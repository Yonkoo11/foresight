// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ReputationEngine
 * @notice Unified reputation system tracking stats across CT Draft, Whisperer, and Timecaster
 * @dev Calculates CT Mastery Score from multiple data sources
 */
contract ReputationEngine {
    // User reputation data
    struct UserReputation {
        // CT Draft stats (updated by backend keeper)
        uint256 draftRank;
        uint256 draftScore;

        // CT Whisperer stats (updated by backend keeper)
        uint256 ctIQ; // 0-100
        uint256 whispererStreak;

        // Timecaster Arena stats (updated by Arena contract)
        uint256 arenaWins;
        uint256 arenaLosses;
        uint256 totalStaked;
        uint256 totalWinnings;

        // Timecaster Gauntlet stats (updated by Gauntlet contract)
        uint256 gauntletDays;
        uint256 totalCorrect;
        uint256 totalPredictions;

        // Combined score
        uint256 ctMasteryScore; // 0-100
        uint256 lastUpdated;
    }

    // State variables
    mapping(address => UserReputation) public reputations;

    address public timecasterArena;
    address public dailyGauntlet;
    address public ctDraft;
    address public keeper; // Backend service that updates off-chain stats
    address public owner;

    uint256 public totalPlayers; // For Draft rank calculation

    // Events
    event ReputationUpdated(address indexed user, uint256 newScore);
    event ContractsSet(address arena, address gauntlet, address draft);
    event KeeperUpdated(address indexed newKeeper);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Errors
    error OnlyArena();
    error OnlyGauntlet();
    error OnlyKeeper();
    error OnlyOwner();
    error InvalidAddress();
    error NotInitialized();

    // Modifiers
    modifier onlyArena() {
        if (msg.sender != timecasterArena) revert OnlyArena();
        _;
    }

    modifier onlyGauntlet() {
        if (msg.sender != dailyGauntlet) revert OnlyGauntlet();
        _;
    }

    modifier onlyKeeper() {
        if (msg.sender != keeper) revert OnlyKeeper();
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Set contract addresses (one-time setup)
     * @param _arena TimecasterArena contract address
     * @param _gauntlet DailyGauntlet contract address
     * @param _draft CTDraft contract address
     */
    function setContracts(
        address _arena,
        address _gauntlet,
        address _draft
    ) external onlyOwner {
        if (_arena == address(0) || _gauntlet == address(0) || _draft == address(0)) {
            revert InvalidAddress();
        }

        timecasterArena = _arena;
        dailyGauntlet = _gauntlet;
        ctDraft = _draft;

        emit ContractsSet(_arena, _gauntlet, _draft);
    }

    /**
     * @notice Set keeper address (backend service)
     * @param _keeper Keeper address
     */
    function setKeeper(address _keeper) external onlyOwner {
        if (_keeper == address(0)) revert InvalidAddress();
        keeper = _keeper;
        emit KeeperUpdated(_keeper);
    }

    /**
     * @notice Update arena stats after duel resolution
     * @param winner Winner address
     * @param loser Loser address
     * @param stake Amount staked
     */
    function updateDuelStats(
        address winner,
        address loser,
        uint256 stake
    ) external onlyArena {
        // Update winner
        UserReputation storage winnerRep = reputations[winner];
        winnerRep.arenaWins++;
        winnerRep.totalStaked += stake;
        winnerRep.totalWinnings += (stake * 2 * 95) / 100; // Winner gets 95% of pot
        winnerRep.ctMasteryScore = _calculateMasteryScore(winner);
        winnerRep.lastUpdated = block.timestamp;

        emit ReputationUpdated(winner, winnerRep.ctMasteryScore);

        // Update loser
        UserReputation storage loserRep = reputations[loser];
        loserRep.arenaLosses++;
        loserRep.totalStaked += stake;
        loserRep.ctMasteryScore = _calculateMasteryScore(loser);
        loserRep.lastUpdated = block.timestamp;

        emit ReputationUpdated(loser, loserRep.ctMasteryScore);
    }

    /**
     * @notice Update gauntlet stats after user claims winnings
     * @param user User address
     * @param correctCount Number of correct predictions (0-5)
     */
    function updateGauntletStats(
        address user,
        uint8 correctCount
    ) external onlyGauntlet {
        UserReputation storage rep = reputations[user];

        rep.gauntletDays++;
        rep.totalCorrect += correctCount;
        rep.totalPredictions += 5; // Always 5 predictions per gauntlet
        rep.ctMasteryScore = _calculateMasteryScore(user);
        rep.lastUpdated = block.timestamp;

        emit ReputationUpdated(user, rep.ctMasteryScore);
    }

    /**
     * @notice Update off-chain stats (Draft, Whisperer) via keeper
     * @param user User address
     * @param draftRank Current Draft rank
     * @param draftScore Current Draft score
     * @param ctIQ CT Whisperer IQ (0-100)
     * @param whispererStreak Whisperer streak
     */
    function updateOffChainStats(
        address user,
        uint256 draftRank,
        uint256 draftScore,
        uint256 ctIQ,
        uint256 whispererStreak
    ) external onlyKeeper {
        UserReputation storage rep = reputations[user];

        rep.draftRank = draftRank;
        rep.draftScore = draftScore;
        rep.ctIQ = ctIQ > 100 ? 100 : ctIQ; // Cap at 100
        rep.whispererStreak = whispererStreak;
        rep.ctMasteryScore = _calculateMasteryScore(user);
        rep.lastUpdated = block.timestamp;

        emit ReputationUpdated(user, rep.ctMasteryScore);
    }

    /**
     * @notice Set total number of players (for Draft rank calculation)
     * @param _totalPlayers Total players count
     */
    function setTotalPlayers(uint256 _totalPlayers) external onlyKeeper {
        totalPlayers = _totalPlayers;
    }

    /**
     * @notice Get user reputation data
     * @param user User address
     */
    function getReputation(address user) external view returns (UserReputation memory) {
        return reputations[user];
    }

    /**
     * @notice Calculate CT Mastery Score (0-100)
     * @param user User address
     * @return masteryScore Combined score
     */
    function calculateMasteryScore(address user) external view returns (uint256) {
        return _calculateMasteryScore(user);
    }

    /**
     * @notice Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();

        address previousOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    /**
     * @dev Internal function to calculate CT Mastery Score
     * Formula: (draftComponent * 0.3) + (whispererComponent * 0.3) + (timecasterComponent * 0.4)
     */
    function _calculateMasteryScore(address user) internal view returns (uint256) {
        UserReputation storage rep = reputations[user];

        // Draft component (0-30 points)
        uint256 draftComponent = 0;
        if (totalPlayers > 0 && rep.draftRank > 0) {
            // Convert rank to score: higher rank (lower number) = higher score
            // rank 1 of 100 = 30 points, rank 100 of 100 = 0 points
            uint256 rankScore = totalPlayers > rep.draftRank
                ? ((totalPlayers - rep.draftRank) * 30) / totalPlayers
                : 0;
            draftComponent = rankScore;
        }

        // Whisperer component (0-30 points)
        uint256 whispererComponent = (rep.ctIQ * 30) / 100;

        // Timecaster component (0-40 points)
        uint256 timecasterComponent = 0;

        // Arena win rate (0-20 points)
        uint256 totalArenaGames = rep.arenaWins + rep.arenaLosses;
        if (totalArenaGames > 0) {
            uint256 arenaWinRate = (rep.arenaWins * 100) / totalArenaGames;
            timecasterComponent += (arenaWinRate * 20) / 100;
        }

        // Gauntlet accuracy (0-20 points)
        if (rep.totalPredictions > 0) {
            uint256 gauntletAccuracy = (rep.totalCorrect * 100) / rep.totalPredictions;
            timecasterComponent += (gauntletAccuracy * 20) / 100;
        }

        // Combine all components
        uint256 totalScore = draftComponent + whispererComponent + timecasterComponent;

        // Cap at 100
        return totalScore > 100 ? 100 : totalScore;
    }
}
