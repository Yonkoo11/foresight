// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Treasury.sol";
import "./ReputationEngine.sol";

/**
 * @title QuestRewards
 * @notice Manages quest reward distribution with anti-exploit mechanisms
 * @dev Implements vesting, budget caps, and sybil resistance
 */
contract QuestRewards {
    // Structs
    struct VestedReward {
        uint256 amount;
        uint256 unlockTime;
        uint256 questId;
        bool claimed;
    }

    struct MonthlyBudget {
        uint256 month; // YYYYMM format
        uint256 allocated;
        uint256 distributed;
        uint256 remaining;
    }

    struct UserEligibility {
        uint256 walletAge; // Block timestamp when wallet first transacted
        uint256 accountAge; // Block timestamp when account created
        uint256 totalGamesPlayed;
        uint256 totalDeposited;
        bool flagged;
    }

    // State variables
    Treasury public treasury;
    ReputationEngine public reputationEngine;
    address public owner;
    address public backend; // Authorized backend for verification

    // Quest tracking
    mapping(uint256 => bool) public questExists;
    mapping(uint256 => uint256) public questMaxCompletions;
    mapping(uint256 => uint256) public questCurrentCompletions;
    mapping(uint256 => mapping(address => uint256)) public userQuestCompletions;

    // Vesting
    mapping(address => VestedReward[]) public userVestedRewards;
    uint256 public constant VESTING_PERIOD = 7 days;

    // Monthly budget
    mapping(uint256 => MonthlyBudget) public monthlyBudgets;
    uint256 public constant MONTHLY_BUDGET_CAP = 10 ether;

    // Eligibility tracking
    mapping(address => UserEligibility) public userEligibility;

    // Anti-exploit
    mapping(address => uint256) public dailyWithdrawals;
    mapping(address => uint256) public lastWithdrawalDay;
    uint256 public constant MAX_DAILY_WITHDRAWAL = 0.1 ether;

    // Events
    event QuestRewardVested(
        address indexed user,
        uint256 indexed questId,
        uint256 amount,
        uint256 unlockTime
    );
    event RewardClaimed(address indexed user, uint256 amount, uint256 rewardCount);
    event BudgetAllocated(uint256 indexed month, uint256 amount);
    event UserFlagged(address indexed user, string reason);
    event QuestRegistered(uint256 indexed questId, uint256 maxCompletions);

    // Errors
    error OnlyOwner();
    error OnlyBackend();
    error InvalidAmount();
    error BudgetExceeded();
    error QuestNotActive();
    error AlreadyCompleted();
    error InsufficientBalance();
    error NoVestedRewards();
    error DailyLimitExceeded();
    error UserIsFlagged();
    error NotEligible();
    error InvalidMonth();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    modifier onlyBackend() {
        if (msg.sender != backend && msg.sender != owner) revert OnlyBackend();
        _;
    }

    modifier notFlagged(address user) {
        if (userEligibility[user].flagged) revert UserIsFlagged();
        _;
    }

    constructor(address _treasury, address _reputationEngine) {
        treasury = Treasury(payable(_treasury));
        reputationEngine = ReputationEngine(_reputationEngine);
        owner = msg.sender;
        backend = msg.sender; // Initially set to owner
    }

    /**
     * @notice Set backend authorization address
     */
    function setBackend(address _backend) external onlyOwner {
        backend = _backend;
    }

    /**
     * @notice Register a quest with max completions
     */
    function registerQuest(uint256 questId, uint256 maxCompletions) external onlyBackend {
        questExists[questId] = true;
        questMaxCompletions[questId] = maxCompletions;
        emit QuestRegistered(questId, maxCompletions);
    }

    /**
     * @notice Allocate monthly budget from Treasury
     */
    function allocateMonthlyBudget(uint256 month, uint256 amount) external onlyOwner {
        if (amount > MONTHLY_BUDGET_CAP) revert BudgetExceeded();
        if (month < 202501) revert InvalidMonth();
        // FINDING-045: Prevent allocating more than contract balance
        require(amount <= address(this).balance, "Budget exceeds balance");

        monthlyBudgets[month] = MonthlyBudget({
            month: month,
            allocated: amount,
            distributed: 0,
            remaining: amount
        });

        emit BudgetAllocated(month, amount);
    }

    /**
     * @notice Award quest reward to user (called by backend after verification)
     * @dev Implements vesting for ETH rewards
     */
    function awardQuestReward(
        address user,
        uint256 questId,
        uint256 ethAmount,
        bool requireVesting
    ) external onlyBackend notFlagged(user) {
        if (!questExists[questId]) revert QuestNotActive();

        // Check global completion cap
        if (
            questMaxCompletions[questId] > 0 &&
            questCurrentCompletions[questId] >= questMaxCompletions[questId]
        ) {
            revert QuestNotActive();
        }

        // Check monthly budget
        uint256 currentMonth = getCurrentMonth();
        MonthlyBudget storage budget = monthlyBudgets[currentMonth];

        if (budget.remaining < ethAmount) {
            // Fallback: reduce to available amount or zero
            ethAmount = budget.remaining;
        }

        if (ethAmount > 0) {
            budget.distributed += ethAmount;
            budget.remaining -= ethAmount;

            // Add to vesting queue
            uint256 unlockTime = block.timestamp + (requireVesting ? VESTING_PERIOD : 0);

            userVestedRewards[user].push(
                VestedReward({
                    amount: ethAmount,
                    unlockTime: unlockTime,
                    questId: questId,
                    claimed: false
                })
            );

            emit QuestRewardVested(user, questId, ethAmount, unlockTime);
        }

        // Track completions
        questCurrentCompletions[questId]++;
        userQuestCompletions[questId][user]++;
    }

    /**
     * @notice Claim all vested rewards
     * @dev Enforces daily withdrawal limits
     */
    function claimVestedRewards() external notFlagged(msg.sender) {
        VestedReward[] storage rewards = userVestedRewards[msg.sender];
        uint256 totalClaim = 0;
        uint256 claimCount = 0;

        for (uint256 i = 0; i < rewards.length; i++) {
            if (!rewards[i].claimed && block.timestamp >= rewards[i].unlockTime) {
                totalClaim += rewards[i].amount;
                rewards[i].claimed = true;
                claimCount++;
            }
        }

        if (totalClaim == 0) revert NoVestedRewards();

        // Check daily withdrawal limit
        uint256 today = block.timestamp / 1 days;
        if (lastWithdrawalDay[msg.sender] != today) {
            dailyWithdrawals[msg.sender] = 0;
            lastWithdrawalDay[msg.sender] = today;
        }

        if (dailyWithdrawals[msg.sender] + totalClaim > MAX_DAILY_WITHDRAWAL) {
            revert DailyLimitExceeded();
        }

        dailyWithdrawals[msg.sender] += totalClaim;

        // FINDING-037: Use .call instead of .transfer (supports smart contract wallets)
        if (address(this).balance < totalClaim) revert InsufficientBalance();
        (bool success, ) = msg.sender.call{value: totalClaim}("");
        require(success, "Transfer failed");

        emit RewardClaimed(msg.sender, totalClaim, claimCount);
    }

    /**
     * @notice Get user's claimable rewards
     */
    function getClaimableRewards(address user) external view returns (uint256) {
        VestedReward[] storage rewards = userVestedRewards[user];
        uint256 total = 0;

        for (uint256 i = 0; i < rewards.length; i++) {
            if (!rewards[i].claimed && block.timestamp >= rewards[i].unlockTime) {
                total += rewards[i].amount;
            }
        }

        return total;
    }

    /**
     * @notice Get user's pending (locked) rewards
     */
    function getPendingRewards(address user) external view returns (uint256) {
        VestedReward[] storage rewards = userVestedRewards[user];
        uint256 total = 0;

        for (uint256 i = 0; i < rewards.length; i++) {
            if (!rewards[i].claimed && block.timestamp < rewards[i].unlockTime) {
                total += rewards[i].amount;
            }
        }

        return total;
    }

    /**
     * @notice Get all user's vested rewards
     */
    function getUserVestedRewards(address user)
        external
        view
        returns (VestedReward[] memory)
    {
        return userVestedRewards[user];
    }

    /**
     * @notice Update user eligibility (called by backend)
     */
    function updateUserEligibility(
        address user,
        uint256 walletAge,
        uint256 accountAge,
        uint256 totalGamesPlayed,
        uint256 totalDeposited
    ) external onlyBackend {
        userEligibility[user] = UserEligibility({
            walletAge: walletAge,
            accountAge: accountAge,
            totalGamesPlayed: totalGamesPlayed,
            totalDeposited: totalDeposited,
            flagged: userEligibility[user].flagged // Preserve flag
        });
    }

    /**
     * @notice Flag user (anti-fraud)
     */
    function flagUser(address user, string calldata reason) external onlyBackend {
        userEligibility[user].flagged = true;
        emit UserFlagged(user, reason);
    }

    /**
     * @notice Unflag user
     */
    function unflagUser(address user) external onlyOwner {
        userEligibility[user].flagged = false;
    }

    /**
     * @notice Get current month in YYYYMM format
     */
    function getCurrentMonth() public view returns (uint256) {
        // Simplified: assumes 30-day months for demo
        // Production should use chainlink oracle for accurate date
        uint256 secondsSince2025 = block.timestamp - 1704067200; // Jan 1, 2025
        uint256 monthsSince2025 = secondsSince2025 / (30 days);
        return 202501 + monthsSince2025;
    }

    /**
     * @notice Emergency withdraw (owner only)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        // FINDING-037: Use .call instead of .transfer
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
    }

    /**
     * @notice Receive ETH
     */
    receive() external payable {}
}
