// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ReputationEngine.sol";
import "./Treasury.sol";

/**
 * @title DailyGauntlet
 * @notice Daily prediction tournaments with 5 auto-generated predictions
 * @dev Oracle resolves predictions, proportional payouts based on accuracy
 */
contract DailyGauntlet {
    // Prediction structure
    struct Prediction {
        uint256 id;
        string question;
        bytes32 oracleKey; // For oracle resolution
        uint256 createdAt;
        uint256 resolutionTime;
        bool resolved;
        bool outcome; // true = YES, false = NO
    }

    // Daily gauntlet (5 predictions)
    struct Gauntlet {
        uint256 day; // Day number (incremental)
        uint256 createdAt;
        uint256[5] predictionIds;
        bool active;
        bool resolved;
        uint256 totalStaked;
        uint256 entryCount;
    }

    // User entry
    struct Entry {
        address user;
        uint256 gauntletDay;
        bool[5] predictions; // User's YES/NO predictions
        uint256 stake;
        uint256 submittedAt;
        uint8 correctCount; // 0-5
        bool resolved;
        bool claimed;
    }

    // State variables
    ReputationEngine public reputationEngine;
    Treasury public treasury;
    address public owner;
    address public oracle;
    address public keeper; // Backend service that creates daily gauntlets

    uint256 private _nextPredictionId;
    uint256 public currentDay;
    uint256 public constant MIN_STAKE = 0.01 ether;
    uint256 public constant PROTOCOL_FEE_PERCENT = 2;
    uint256 public constant PREDICTIONS_PER_GAUNTLET = 5;

    mapping(uint256 => Prediction) public predictions;
    mapping(uint256 => Gauntlet) public gauntlets;
    mapping(address => mapping(uint256 => Entry)) public userEntries; // user => day => entry
    mapping(uint256 => address[]) public gauntletParticipants; // day => participants

    // Payout tiers (based on correct count)
    mapping(uint256 => uint8) public correctCountToParticipants; // day => correctCount => count

    // Events
    event GauntletCreated(uint256 indexed day, uint256[5] predictionIds);
    event PredictionCreated(uint256 indexed predictionId, string question, uint256 resolutionTime);
    event EntrySubmitted(address indexed user, uint256 indexed day, uint256 stake);
    event PredictionResolved(uint256 indexed predictionId, bool outcome);
    event GauntletResolved(uint256 indexed day);
    event RewardClaimed(address indexed user, uint256 indexed day, uint256 amount, uint8 correctCount);
    event KeeperUpdated(address indexed keeper);

    // Errors
    error OnlyOwner();
    error OnlyOracle();
    error OnlyKeeper();
    error InvalidStake();
    error GauntletNotActive();
    error AlreadyEntered();
    error GauntletNotResolved();
    error AlreadyClaimed();
    error NoPayout();
    error InvalidPredictionCount();
    error InvalidDay();
    error PredictionNotResolved();
    error AlreadyResolved();
    error InvalidAddress();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    modifier onlyOracle() {
        if (msg.sender != oracle) revert OnlyOracle();
        _;
    }

    modifier onlyKeeper() {
        if (msg.sender != keeper) revert OnlyKeeper();
        _;
    }

    constructor(address _reputationEngine, address _treasury) {
        if (_reputationEngine == address(0) || _treasury == address(0)) {
            revert InvalidAddress();
        }
        reputationEngine = ReputationEngine(_reputationEngine);
        treasury = Treasury(payable(_treasury));
        owner = msg.sender;
    }

    /**
     * @notice Create a new prediction (called by keeper)
     * @param question Prediction question
     * @param oracleKey Oracle identifier for resolution
     * @param resolutionTime When to resolve the prediction
     */
    function createPrediction(
        string calldata question,
        bytes32 oracleKey,
        uint256 resolutionTime
    ) external onlyKeeper returns (uint256) {
        uint256 predictionId = _nextPredictionId++;

        predictions[predictionId] = Prediction({
            id: predictionId,
            question: question,
            oracleKey: oracleKey,
            createdAt: block.timestamp,
            resolutionTime: resolutionTime,
            resolved: false,
            outcome: false
        });

        emit PredictionCreated(predictionId, question, resolutionTime);
        return predictionId;
    }

    /**
     * @notice Create a daily gauntlet with 5 predictions (called by keeper)
     * @param predictionIds Array of 5 prediction IDs
     */
    function createGauntlet(uint256[5] calldata predictionIds) external onlyKeeper {
        uint256 day = currentDay++;

        gauntlets[day] = Gauntlet({
            day: day,
            createdAt: block.timestamp,
            predictionIds: predictionIds,
            active: true,
            resolved: false,
            totalStaked: 0,
            entryCount: 0
        });

        emit GauntletCreated(day, predictionIds);
    }

    /**
     * @notice Submit entry for current gauntlet
     * @param userPredictions User's YES/NO predictions for all 5 questions
     */
    function submitEntry(bool[5] calldata userPredictions) external payable {
        if (msg.value < MIN_STAKE) revert InvalidStake();

        uint256 day = currentDay - 1; // Current active gauntlet
        Gauntlet storage gauntlet = gauntlets[day];

        if (!gauntlet.active) revert GauntletNotActive();
        if (userEntries[msg.sender][day].user != address(0)) revert AlreadyEntered();

        // Store entry
        userEntries[msg.sender][day] = Entry({
            user: msg.sender,
            gauntletDay: day,
            predictions: userPredictions,
            stake: msg.value,
            submittedAt: block.timestamp,
            correctCount: 0,
            resolved: false,
            claimed: false
        });

        gauntlet.totalStaked += msg.value;
        gauntlet.entryCount++;
        gauntletParticipants[day].push(msg.sender);

        emit EntrySubmitted(msg.sender, day, msg.value);
    }

    /**
     * @notice Resolve a prediction (called by oracle)
     * @param predictionId Prediction ID
     * @param outcome True = YES, False = NO
     */
    function resolvePrediction(uint256 predictionId, bool outcome) external onlyOracle {
        Prediction storage prediction = predictions[predictionId];

        if (prediction.resolved) revert AlreadyResolved();
        if (block.timestamp < prediction.resolutionTime) revert InvalidDay();

        prediction.resolved = true;
        prediction.outcome = outcome;

        emit PredictionResolved(predictionId, outcome);
    }

    /**
     * @notice Resolve a gauntlet after all predictions are resolved
     * @param day Gauntlet day to resolve
     */
    function resolveGauntlet(uint256 day) external {
        Gauntlet storage gauntlet = gauntlets[day];

        if (gauntlet.resolved) revert AlreadyResolved();
        if (!gauntlet.active) revert GauntletNotActive();

        // Check all predictions are resolved
        for (uint256 i = 0; i < PREDICTIONS_PER_GAUNTLET; i++) {
            if (!predictions[gauntlet.predictionIds[i]].resolved) {
                revert PredictionNotResolved();
            }
        }

        gauntlet.resolved = true;
        gauntlet.active = false;

        // Calculate correct counts for all participants
        address[] storage participants = gauntletParticipants[day];
        uint256[6] memory countByCorrect; // Index = correct count (0-5)

        for (uint256 i = 0; i < participants.length; i++) {
            Entry storage entry = userEntries[participants[i]][day];
            uint8 correct = _calculateCorrect(day, entry.predictions);

            entry.correctCount = correct;
            entry.resolved = true;
            countByCorrect[correct]++;

            // Update reputation (only count gauntlet participation)
            reputationEngine.updateGauntletStats(participants[i], correct);
        }

        emit GauntletResolved(day);
    }

    /**
     * @notice Claim rewards for a resolved gauntlet
     * @param day Gauntlet day
     */
    function claimReward(uint256 day) external {
        Gauntlet storage gauntlet = gauntlets[day];
        Entry storage entry = userEntries[msg.sender][day];

        if (!gauntlet.resolved) revert GauntletNotResolved();
        if (entry.user == address(0)) revert NoPayout();
        if (entry.claimed) revert AlreadyClaimed();

        // Only 3/5, 4/5, and 5/5 get payouts
        if (entry.correctCount < 3) revert NoPayout();

        entry.claimed = true;

        // Calculate payout
        uint256 totalPool = gauntlet.totalStaked;
        uint256 protocolFee = (totalPool * PROTOCOL_FEE_PERCENT) / 100;
        uint256 rewardPool = totalPool - protocolFee;

        uint256 payout = _calculatePayout(day, entry.correctCount, rewardPool);

        // Transfer protocol fee to treasury
        if (protocolFee > 0) {
            payable(address(treasury)).transfer(protocolFee);
        }

        // Transfer payout to user
        if (payout > 0) {
            payable(msg.sender).transfer(payout);
        }

        emit RewardClaimed(msg.sender, day, payout, entry.correctCount);
    }

    /**
     * @notice Calculate how many predictions user got correct
     */
    function _calculateCorrect(uint256 day, bool[5] memory userPredictions)
        private
        view
        returns (uint8)
    {
        Gauntlet storage gauntlet = gauntlets[day];
        uint8 correct = 0;

        for (uint256 i = 0; i < PREDICTIONS_PER_GAUNTLET; i++) {
            Prediction storage prediction = predictions[gauntlet.predictionIds[i]];
            if (userPredictions[i] == prediction.outcome) {
                correct++;
            }
        }

        return correct;
    }

    /**
     * @notice Calculate payout based on correct count
     * @dev Proportional distribution:
     *      5/5: 50% of pool (split among 5/5 users)
     *      4/5: 35% of pool (split among 4/5 users)
     *      3/5: 15% of pool (split among 3/5 users)
     */
    function _calculatePayout(uint256 day, uint8 correctCount, uint256 rewardPool)
        private
        view
        returns (uint256)
    {
        address[] storage participants = gauntletParticipants[day];

        // Count how many users got this correct count
        uint256 sameCountUsers = 0;
        for (uint256 i = 0; i < participants.length; i++) {
            Entry storage entry = userEntries[participants[i]][day];
            if (entry.correctCount == correctCount) {
                sameCountUsers++;
            }
        }

        if (sameCountUsers == 0) return 0;

        // Calculate tier pool
        uint256 tierPool;
        if (correctCount == 5) {
            tierPool = (rewardPool * 50) / 100;
        } else if (correctCount == 4) {
            tierPool = (rewardPool * 35) / 100;
        } else if (correctCount == 3) {
            tierPool = (rewardPool * 15) / 100;
        } else {
            return 0;
        }

        return tierPool / sameCountUsers;
    }

    /**
     * @notice Get gauntlet details
     */
    function getGauntlet(uint256 day) external view returns (Gauntlet memory) {
        return gauntlets[day];
    }

    /**
     * @notice Get user's entry for a specific day
     */
    function getEntry(address user, uint256 day) external view returns (Entry memory) {
        return userEntries[user][day];
    }

    /**
     * @notice Get prediction details
     */
    function getPrediction(uint256 predictionId) external view returns (Prediction memory) {
        return predictions[predictionId];
    }

    /**
     * @notice Get all participants for a gauntlet day
     */
    function getParticipants(uint256 day) external view returns (address[] memory) {
        return gauntletParticipants[day];
    }

    /**
     * @notice Set oracle address
     */
    function setOracle(address _oracle) external onlyOwner {
        if (_oracle == address(0)) revert InvalidAddress();
        oracle = _oracle;
    }

    /**
     * @notice Set keeper address
     */
    function setKeeper(address _keeper) external onlyOwner {
        if (_keeper == address(0)) revert InvalidAddress();
        keeper = _keeper;
        emit KeeperUpdated(_keeper);
    }

    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        owner = newOwner;
    }
}
