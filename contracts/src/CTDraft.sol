// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CTDraft
 * @notice Stores fantasy team selections on-chain
 * @dev Most Draft logic (scoring, rankings) happens off-chain in backend
 */
contract CTDraft {
    // Team structure
    struct Team {
        address user;
        uint256[5] influencerIds; // References to off-chain influencer IDs (1-100)
        uint256 lastUpdated;
        bool exists;
    }

    // State variables
    mapping(address => Team) public teams;
    address[] public allPlayers;

    address public owner;
    uint256 public constant TEAM_SIZE = 5;
    uint256 public constant MAX_INFLUENCER_ID = 100; // Top 100 CT accounts

    // Events
    event TeamCreated(address indexed user, uint256[5] influencerIds);
    event TeamUpdated(address indexed user, uint256[5] influencerIds);

    // Errors
    error InvalidTeamSize();
    error InvalidInfluencerId(uint256 id);
    error DuplicateInfluencer();
    error OnlyOwner();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Create or update user's fantasy team
     * @param influencerIds Array of 5 influencer IDs (1-100)
     * @dev Validates team composition and stores on-chain
     */
    function setTeam(uint256[5] calldata influencerIds) external {
        // Validate all influencer IDs are within range
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

        bool isNewTeam = !teams[msg.sender].exists;

        // Create or update team
        teams[msg.sender] = Team({
            user: msg.sender,
            influencerIds: influencerIds,
            lastUpdated: block.timestamp,
            exists: true
        });

        // Track new players
        if (isNewTeam) {
            allPlayers.push(msg.sender);
            emit TeamCreated(msg.sender, influencerIds);
        } else {
            emit TeamUpdated(msg.sender, influencerIds);
        }
    }

    /**
     * @notice Get user's team
     * @param user User address
     * @return team Team struct
     */
    function getTeam(address user) external view returns (Team memory) {
        return teams[user];
    }

    /**
     * @notice Get user's team influencer IDs only
     * @param user User address
     * @return influencerIds Array of 5 influencer IDs
     */
    function getTeamInfluencers(address user) external view returns (uint256[5] memory) {
        return teams[user].influencerIds;
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
     * @notice Get total number of players (teams created)
     * @return count Number of players
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
     * @notice Get teams in batch (for backend indexing)
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
     * @notice Update max influencer ID (if we add more tracked accounts)
     * @param newMax New maximum influencer ID
     * @dev Only owner can call this
     */
    function setMaxInfluencerId(uint256 newMax) external onlyOwner {
        // Note: This is stored as constant, so this function would need
        // to be implemented with a state variable instead if we want it dynamic
        // For now, it's fixed at 100 (top 100 CT accounts)
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
