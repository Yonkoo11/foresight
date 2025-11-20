// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ReputationEngine.sol";
import "./Treasury.sol";

/**
 * @title TimecasterArena
 * @notice 1v1 prediction duels with three resolution types
 * @dev Handles PRICE (oracle), PROTOCOL (on-chain), and NARRATIVE (voting) duels
 */
contract TimecasterArena {
    // Duel types
    enum DuelType { PRICE, PROTOCOL, NARRATIVE }
    enum DuelStatus { PENDING, ACTIVE, RESOLVED, CANCELLED, VOTING }

    // Duel structure
    struct Duel {
        uint256 id;
        address creator;
        address opponent;
        DuelType duelType;
        DuelStatus status;

        string question;
        string creatorPosition; // "YES" or "NO"
        string opponentPosition; // Opposite of creator

        uint256 stake;
        uint256 createdAt;
        uint256 acceptedAt;
        uint256 expiresAt;
        uint256 resolutionTime;

        address winner;
        bool resolved;

        // Type-specific data
        bytes32 oracleKey; // For PRICE duels
        uint256 targetPrice; // For PRICE duels
        string protocolMetric; // For PROTOCOL duels
        uint256 targetValue; // For PROTOCOL duels
    }

    // Voting structure for NARRATIVE duels
    struct Vote {
        address voter;
        bool votedForCreator; // true = creator wins, false = opponent wins
        uint256 stake;
        bool claimed;
    }

    // State variables
    ReputationEngine public reputationEngine;
    Treasury public treasury;
    address public owner;
    address public oracle; // Chainlink oracle or keeper

    uint256 private _nextDuelId;
    uint256 public constant ACCEPT_DEADLINE = 48 hours;
    uint256 public constant VOTING_PERIOD = 24 hours;
    uint256 public constant MIN_VOTES = 10;
    uint256 public constant VOTE_STAKE = 0.01 ether;
    uint256 public constant PROTOCOL_FEE_PERCENT = 5;

    mapping(uint256 => Duel) public duels;
    mapping(uint256 => Vote[]) public duelVotes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // Events
    event DuelCreated(
        uint256 indexed duelId,
        address indexed creator,
        DuelType duelType,
        string question,
        uint256 stake
    );
    event DuelAccepted(uint256 indexed duelId, address indexed opponent);
    event DuelResolved(uint256 indexed duelId, address indexed winner, uint256 payout);
    event DuelCancelled(uint256 indexed duelId);
    event VoteCast(uint256 indexed duelId, address indexed voter, bool votedForCreator);
    event VoteRewardClaimed(uint256 indexed duelId, address indexed voter, uint256 amount);

    // Errors
    error OnlyOwner();
    error OnlyOracle();
    error InvalidStake();
    error InvalidDuelType();
    error DuelNotFound();
    error DuelNotPending();
    error DuelNotActive();
    error DuelExpired();
    error DuelNotExpired();
    error CannotAcceptOwnDuel();
    error AlreadyResolved();
    error VotingNotOpen();
    error AlreadyVoted();
    error InsufficientVoteStake();
    error NotEnoughVotes();
    error NoRewardToClaim();
    error InvalidAddress();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    modifier onlyOracle() {
        if (msg.sender != oracle) revert OnlyOracle();
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
     * @notice Create a new PRICE duel
     * @param question Duel question
     * @param position Creator's position (YES/NO)
     * @param oracleKey Oracle identifier (e.g., "ETH/USD")
     * @param targetPrice Target price in 8 decimals (Chainlink format)
     * @param resolutionTime When to check the price
     */
    function createPriceDuel(
        string calldata question,
        string calldata position,
        bytes32 oracleKey,
        uint256 targetPrice,
        uint256 resolutionTime
    ) external payable returns (uint256) {
        if (msg.value == 0) revert InvalidStake();
        if (resolutionTime <= block.timestamp) revert InvalidDuelType();

        uint256 duelId = _nextDuelId++;

        duels[duelId] = Duel({
            id: duelId,
            creator: msg.sender,
            opponent: address(0),
            duelType: DuelType.PRICE,
            status: DuelStatus.PENDING,
            question: question,
            creatorPosition: position,
            opponentPosition: _oppositePosition(position),
            stake: msg.value,
            createdAt: block.timestamp,
            acceptedAt: 0,
            expiresAt: block.timestamp + ACCEPT_DEADLINE,
            resolutionTime: resolutionTime,
            winner: address(0),
            resolved: false,
            oracleKey: oracleKey,
            targetPrice: targetPrice,
            protocolMetric: "",
            targetValue: 0
        });

        emit DuelCreated(duelId, msg.sender, DuelType.PRICE, question, msg.value);
        return duelId;
    }

    /**
     * @notice Create a new PROTOCOL duel
     * @param question Duel question
     * @param position Creator's position (YES/NO)
     * @param protocolMetric On-chain metric to verify (e.g., "BASE_TVL")
     * @param targetValue Target value for the metric
     * @param resolutionTime When to check the metric
     */
    function createProtocolDuel(
        string calldata question,
        string calldata position,
        string calldata protocolMetric,
        uint256 targetValue,
        uint256 resolutionTime
    ) external payable returns (uint256) {
        if (msg.value == 0) revert InvalidStake();
        if (resolutionTime <= block.timestamp) revert InvalidDuelType();

        uint256 duelId = _nextDuelId++;

        duels[duelId] = Duel({
            id: duelId,
            creator: msg.sender,
            opponent: address(0),
            duelType: DuelType.PROTOCOL,
            status: DuelStatus.PENDING,
            question: question,
            creatorPosition: position,
            opponentPosition: _oppositePosition(position),
            stake: msg.value,
            createdAt: block.timestamp,
            acceptedAt: 0,
            expiresAt: block.timestamp + ACCEPT_DEADLINE,
            resolutionTime: resolutionTime,
            winner: address(0),
            resolved: false,
            oracleKey: bytes32(0),
            targetPrice: 0,
            protocolMetric: protocolMetric,
            targetValue: targetValue
        });

        emit DuelCreated(duelId, msg.sender, DuelType.PROTOCOL, question, msg.value);
        return duelId;
    }

    /**
     * @notice Create a new NARRATIVE duel (community voting)
     * @param question Duel question
     * @param position Creator's position (YES/NO)
     * @param votingEndsAt When voting ends
     */
    function createNarrativeDuel(
        string calldata question,
        string calldata position,
        uint256 votingEndsAt
    ) external payable returns (uint256) {
        if (msg.value == 0) revert InvalidStake();
        if (votingEndsAt <= block.timestamp + VOTING_PERIOD) revert InvalidDuelType();

        uint256 duelId = _nextDuelId++;

        duels[duelId] = Duel({
            id: duelId,
            creator: msg.sender,
            opponent: address(0),
            duelType: DuelType.NARRATIVE,
            status: DuelStatus.PENDING,
            question: question,
            creatorPosition: position,
            opponentPosition: _oppositePosition(position),
            stake: msg.value,
            createdAt: block.timestamp,
            acceptedAt: 0,
            expiresAt: block.timestamp + ACCEPT_DEADLINE,
            resolutionTime: votingEndsAt,
            winner: address(0),
            resolved: false,
            oracleKey: bytes32(0),
            targetPrice: 0,
            protocolMetric: "",
            targetValue: 0
        });

        emit DuelCreated(duelId, msg.sender, DuelType.NARRATIVE, question, msg.value);
        return duelId;
    }

    /**
     * @notice Accept a pending duel
     * @param duelId Duel ID to accept
     */
    function acceptDuel(uint256 duelId) external payable {
        Duel storage duel = duels[duelId];

        if (duel.creator == address(0)) revert DuelNotFound();
        if (duel.status != DuelStatus.PENDING) revert DuelNotPending();
        if (block.timestamp > duel.expiresAt) revert DuelExpired();
        if (msg.sender == duel.creator) revert CannotAcceptOwnDuel();
        if (msg.value != duel.stake) revert InvalidStake();

        duel.opponent = msg.sender;
        duel.acceptedAt = block.timestamp;

        if (duel.duelType == DuelType.NARRATIVE) {
            duel.status = DuelStatus.VOTING;
        } else {
            duel.status = DuelStatus.ACTIVE;
        }

        emit DuelAccepted(duelId, msg.sender);
    }

    /**
     * @notice Cancel a pending duel that wasn't accepted
     * @param duelId Duel ID to cancel
     */
    function cancelDuel(uint256 duelId) external {
        Duel storage duel = duels[duelId];

        if (duel.creator == address(0)) revert DuelNotFound();
        if (duel.status != DuelStatus.PENDING) revert DuelNotPending();
        if (msg.sender != duel.creator) revert OnlyOwner();
        if (block.timestamp <= duel.expiresAt) revert DuelNotExpired();

        duel.status = DuelStatus.CANCELLED;

        // Refund creator
        payable(duel.creator).transfer(duel.stake);

        emit DuelCancelled(duelId);
    }

    /**
     * @notice Vote on a NARRATIVE duel
     * @param duelId Duel ID
     * @param voteForCreator True if voting for creator to win
     */
    function vote(uint256 duelId, bool voteForCreator) external payable {
        Duel storage duel = duels[duelId];

        if (duel.creator == address(0)) revert DuelNotFound();
        if (duel.status != DuelStatus.VOTING) revert VotingNotOpen();
        if (block.timestamp > duel.resolutionTime) revert DuelExpired();
        if (hasVoted[duelId][msg.sender]) revert AlreadyVoted();
        if (msg.value != VOTE_STAKE) revert InsufficientVoteStake();

        duelVotes[duelId].push(Vote({
            voter: msg.sender,
            votedForCreator: voteForCreator,
            stake: msg.value,
            claimed: false
        }));

        hasVoted[duelId][msg.sender] = true;

        emit VoteCast(duelId, msg.sender, voteForCreator);
    }

    /**
     * @notice Resolve a PRICE or PROTOCOL duel (called by oracle)
     * @param duelId Duel ID
     * @param creatorWon True if creator won
     */
    function resolveDuel(uint256 duelId, bool creatorWon) external onlyOracle {
        Duel storage duel = duels[duelId];

        if (duel.creator == address(0)) revert DuelNotFound();
        if (duel.status != DuelStatus.ACTIVE) revert DuelNotActive();
        if (duel.resolved) revert AlreadyResolved();
        if (block.timestamp < duel.resolutionTime) revert DuelNotExpired();

        duel.resolved = true;
        duel.status = DuelStatus.RESOLVED;
        duel.winner = creatorWon ? duel.creator : duel.opponent;

        _distributePayout(duel);
    }

    /**
     * @notice Resolve a NARRATIVE duel based on votes
     * @param duelId Duel ID
     */
    function resolveNarrativeDuel(uint256 duelId) external {
        Duel storage duel = duels[duelId];

        if (duel.creator == address(0)) revert DuelNotFound();
        if (duel.status != DuelStatus.VOTING) revert VotingNotOpen();
        if (duel.resolved) revert AlreadyResolved();
        if (block.timestamp < duel.resolutionTime) revert DuelNotExpired();

        Vote[] storage votes = duelVotes[duelId];
        if (votes.length < MIN_VOTES) revert NotEnoughVotes();

        // Count votes
        uint256 creatorVotes = 0;
        uint256 opponentVotes = 0;

        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].votedForCreator) {
                creatorVotes++;
            } else {
                opponentVotes++;
            }
        }

        duel.resolved = true;
        duel.status = DuelStatus.RESOLVED;
        duel.winner = creatorVotes > opponentVotes ? duel.creator : duel.opponent;

        _distributePayout(duel);
    }

    /**
     * @notice Claim voting rewards (for NARRATIVE duels)
     * @param duelId Duel ID
     */
    function claimVoteReward(uint256 duelId) external {
        Duel storage duel = duels[duelId];

        if (!duel.resolved) revert DuelNotActive();
        if (duel.duelType != DuelType.NARRATIVE) revert InvalidDuelType();

        Vote[] storage votes = duelVotes[duelId];

        // Find voter's vote
        uint256 voterIndex = type(uint256).max;
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].voter == msg.sender) {
                voterIndex = i;
                break;
            }
        }

        if (voterIndex == type(uint256).max) revert NoRewardToClaim();
        if (votes[voterIndex].claimed) revert NoRewardToClaim();

        // Check if voter voted correctly
        bool votedCorrectly = (votes[voterIndex].votedForCreator && duel.winner == duel.creator) ||
                              (!votes[voterIndex].votedForCreator && duel.winner == duel.opponent);

        if (!votedCorrectly) revert NoRewardToClaim();

        // Calculate rewards (correct voters split incorrect voters' stakes)
        uint256 correctVotes = 0;
        uint256 incorrectStakePool = 0;

        for (uint256 i = 0; i < votes.length; i++) {
            bool votedRight = (votes[i].votedForCreator && duel.winner == duel.creator) ||
                             (!votes[i].votedForCreator && duel.winner == duel.opponent);

            if (votedRight) {
                correctVotes++;
            } else {
                incorrectStakePool += votes[i].stake;
            }
        }

        votes[voterIndex].claimed = true;

        // Payout: original stake + share of incorrect stakes
        uint256 reward = VOTE_STAKE + (incorrectStakePool / correctVotes);
        payable(msg.sender).transfer(reward);

        emit VoteRewardClaimed(duelId, msg.sender, reward);
    }

    /**
     * @notice Distribute payout to winner
     */
    function _distributePayout(Duel storage duel) private {
        uint256 totalStake = duel.stake * 2;
        uint256 protocolFee = (totalStake * PROTOCOL_FEE_PERCENT) / 100;
        uint256 winnerPayout = totalStake - protocolFee;

        // Update reputation
        reputationEngine.updateDuelStats(duel.winner,
            duel.winner == duel.creator ? duel.opponent : duel.creator,
            duel.stake);

        // Transfer winnings
        payable(duel.winner).transfer(winnerPayout);

        // Transfer fee to treasury
        payable(address(treasury)).transfer(protocolFee);

        emit DuelResolved(duel.id, duel.winner, winnerPayout);
    }

    /**
     * @notice Get opposite position
     */
    function _oppositePosition(string memory position) private pure returns (string memory) {
        bytes32 posHash = keccak256(abi.encodePacked(position));
        if (posHash == keccak256(abi.encodePacked("YES"))) {
            return "NO";
        }
        return "YES";
    }

    /**
     * @notice Get duel details
     */
    function getDuel(uint256 duelId) external view returns (Duel memory) {
        return duels[duelId];
    }

    /**
     * @notice Get votes for a NARRATIVE duel
     */
    function getVotes(uint256 duelId) external view returns (Vote[] memory) {
        return duelVotes[duelId];
    }

    /**
     * @notice Set oracle address
     */
    function setOracle(address _oracle) external onlyOwner {
        if (_oracle == address(0)) revert InvalidAddress();
        oracle = _oracle;
    }

    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        owner = newOwner;
    }
}
