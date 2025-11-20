// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CTDraftV2
 * @notice Enhanced fantasy draft with team names, captains, and better UX
 * @dev Inspired by Fantasy Premier League - stores teams on-chain with metadata
 */
contract CTDraftV2 {
    // Team structure (inspired by FPL)
    struct Team {
        address user;
        string teamName;          // NEW: User can name their team!
        uint256[5] influencerIds; // 5 influencers (1-100)
        uint256 captainId;        // NEW: Captain gets 2x points (like FPL)
        uint256 viceCaptainId;    // NEW: Vice captain (backup if captain inactive)
        uint256 lastUpdated;
        uint256 weekCreated;      // Track which week team was created
        bool exists;
    }

    // State variables
    mapping(address => Team) public teams;
    mapping(string => address) public teamNameToUser; // Prevent duplicate team names
    address[] public allPlayers;

    address public owner;
    uint256 public constant TEAM_SIZE = 5;
    uint256 public constant MAX_INFLUENCER_ID = 100; // Top 100 CT accounts
    uint256 public constant MAX_TEAM_NAME_LENGTH = 32;

    uint256 public currentWeek; // Track current game week

    // Events
    event TeamCreated(address indexed user, string teamName, uint256[5] influencerIds);
    event TeamUpdated(address indexed user, string teamName, uint256[5] influencerIds);
    event TeamNameChanged(address indexed user, string oldName, string newName);
    event CaptainChanged(address indexed user, uint256 captainId, uint256 viceCaptainId);

    // Errors
    error InvalidTeamSize();
    error InvalidInfluencerId(uint256 id);
    error DuplicateInfluencer();
    error OnlyOwner();
    error TeamNameTaken();
    error TeamNameTooLong();
    error TeamNameEmpty();
    error InvalidCaptain();
    error InvalidViceCaptain();
    error TeamDoesNotExist();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
        currentWeek = 1; // Start at week 1
    }

    /**
     * @notice Create or update user's fantasy team with team name (like FPL)
     * @param teamName User's chosen team name (max 32 chars)
     * @param influencerIds Array of 5 influencer IDs (1-100)
     * @param captainId ID of captain (gets 2x points)
     * @param viceCaptainId ID of vice captain (backup)
     */
    function setTeam(
        string calldata teamName,
        uint256[5] calldata influencerIds,
        uint256 captainId,
        uint256 viceCaptainId
    ) external {
        // Validate team name
        if (bytes(teamName).length == 0) revert TeamNameEmpty();
        if (bytes(teamName).length > MAX_TEAM_NAME_LENGTH) revert TeamNameTooLong();

        // Check if team name is taken (unless it's the user's own team)
        address existingOwner = teamNameToUser[teamName];
        if (existingOwner != address(0) && existingOwner != msg.sender) {
            revert TeamNameTaken();
        }

        // Validate all influencer IDs
        for (uint256 i = 0; i < TEAM_SIZE; i++) {
            if (influencerIds[i] == 0 || influencerIds[i] > MAX_INFLUENCER_ID) {
                revert InvalidInfluencerId(influencerIds[i]);
            }
        }

        // Check for duplicates
        for (uint256 i = 0; i < TEAM_SIZE; i++) {
            for (uint256 j = i + 1; j < TEAM_SIZE; j++) {
                if (influencerIds[i] == influencerIds[j]) {
                    revert DuplicateInfluencer();
                }
            }
        }

        // Validate captain is in team
        bool captainInTeam = false;
        bool viceCaptainInTeam = false;
        for (uint256 i = 0; i < TEAM_SIZE; i++) {
            if (influencerIds[i] == captainId) captainInTeam = true;
            if (influencerIds[i] == viceCaptainId) viceCaptainInTeam = true;
        }
        if (!captainInTeam) revert InvalidCaptain();
        if (!viceCaptainInTeam) revert InvalidViceCaptain();
        if (captainId == viceCaptainId) revert InvalidViceCaptain();

        bool isNewTeam = !teams[msg.sender].exists;

        // If changing team name, release old name
        if (!isNewTeam && keccak256(bytes(teams[msg.sender].teamName)) != keccak256(bytes(teamName))) {
            delete teamNameToUser[teams[msg.sender].teamName];
        }

        // Reserve new team name
        teamNameToUser[teamName] = msg.sender;

        // Create or update team
        teams[msg.sender] = Team({
            user: msg.sender,
            teamName: teamName,
            influencerIds: influencerIds,
            captainId: captainId,
            viceCaptainId: viceCaptainId,
            lastUpdated: block.timestamp,
            weekCreated: isNewTeam ? currentWeek : teams[msg.sender].weekCreated,
            exists: true
        });

        // Track new players
        if (isNewTeam) {
            allPlayers.push(msg.sender);
            emit TeamCreated(msg.sender, teamName, influencerIds);
        } else {
            emit TeamUpdated(msg.sender, teamName, influencerIds);
        }
    }

    /**
     * @notice Update only team name (quick rename like FPL)
     * @param newTeamName New team name
     */
    function updateTeamName(string calldata newTeamName) external {
        if (!teams[msg.sender].exists) revert TeamDoesNotExist();
        if (bytes(newTeamName).length == 0) revert TeamNameEmpty();
        if (bytes(newTeamName).length > MAX_TEAM_NAME_LENGTH) revert TeamNameTooLong();

        // Check if new name is available
        address existingOwner = teamNameToUser[newTeamName];
        if (existingOwner != address(0) && existingOwner != msg.sender) {
            revert TeamNameTaken();
        }

        string memory oldName = teams[msg.sender].teamName;

        // Release old name
        delete teamNameToUser[oldName];

        // Reserve new name
        teamNameToUser[newTeamName] = msg.sender;

        // Update team
        teams[msg.sender].teamName = newTeamName;
        teams[msg.sender].lastUpdated = block.timestamp;

        emit TeamNameChanged(msg.sender, oldName, newTeamName);
    }

    /**
     * @notice Update captain selection (can do this without changing full team)
     * @param captainId New captain ID
     * @param viceCaptainId New vice captain ID
     */
    function updateCaptains(uint256 captainId, uint256 viceCaptainId) external {
        if (!teams[msg.sender].exists) revert TeamDoesNotExist();

        Team storage team = teams[msg.sender];

        // Validate captain and vice captain are in team
        bool captainInTeam = false;
        bool viceCaptainInTeam = false;
        for (uint256 i = 0; i < TEAM_SIZE; i++) {
            if (team.influencerIds[i] == captainId) captainInTeam = true;
            if (team.influencerIds[i] == viceCaptainId) viceCaptainInTeam = true;
        }
        if (!captainInTeam) revert InvalidCaptain();
        if (!viceCaptainInTeam) revert InvalidViceCaptain();
        if (captainId == viceCaptainId) revert InvalidViceCaptain();

        team.captainId = captainId;
        team.viceCaptainId = viceCaptainId;
        team.lastUpdated = block.timestamp;

        emit CaptainChanged(msg.sender, captainId, viceCaptainId);
    }

    /**
     * @notice Get user's full team with all metadata
     * @param user User address
     * @return team Complete team struct
     */
    function getTeam(address user) external view returns (Team memory) {
        return teams[user];
    }

    /**
     * @notice Get user's team name
     * @param user User address
     * @return teamName The team's name
     */
    function getTeamName(address user) external view returns (string memory) {
        return teams[user].teamName;
    }

    /**
     * @notice Get user's team influencer IDs
     * @param user User address
     * @return influencerIds Array of 5 influencer IDs
     */
    function getTeamInfluencers(address user) external view returns (uint256[5] memory) {
        return teams[user].influencerIds;
    }

    /**
     * @notice Check if team name is available
     * @param teamName Proposed team name
     * @return available True if name is available
     */
    function isTeamNameAvailable(string calldata teamName) external view returns (bool) {
        return teamNameToUser[teamName] == address(0);
    }

    /**
     * @notice Check if user has a team
     * @param user User address
     * @return hasTeam True if user has created a team
     */
    function hasTeam(address user) external view returns (bool) {
        return teams[user].exists;
    }

    /**
     * @notice Get total number of players
     * @return count Number of teams created
     */
    function getPlayerCount() external view returns (uint256) {
        return allPlayers.length;
    }

    /**
     * @notice Get all players (paginated)
     * @param offset Starting index
     * @param limit Number of players to return
     * @return players Array of player addresses
     */
    function getAllPlayers(uint256 offset, uint256 limit)
        external
        view
        returns (address[] memory)
    {
        uint256 total = allPlayers.length;
        if (offset >= total) {
            return new address[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        address[] memory players = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            players[i - offset] = allPlayers[i];
        }

        return players;
    }

    /**
     * @notice Get teams in batch
     * @param users Array of user addresses
     * @return batchTeams Array of teams
     */
    function getTeamsBatch(address[] calldata users)
        external
        view
        returns (Team[] memory)
    {
        Team[] memory batchTeams = new Team[](users.length);

        for (uint256 i = 0; i < users.length; i++) {
            batchTeams[i] = teams[users[i]];
        }

        return batchTeams;
    }

    /**
     * @notice Increment game week (backend/owner only)
     */
    function incrementWeek() external onlyOwner {
        currentWeek++;
    }

    /**
     * @notice Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
