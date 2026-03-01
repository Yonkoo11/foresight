// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Treasury
 * @notice Collects protocol fees and distributes monthly rewards
 * @dev Receives fees from TimecasterArena and DailyGauntlet contracts
 */
contract Treasury {
    // State variables
    address public owner;
    uint256 public currentMonthFees;

    // Monthly pools
    struct MonthlyPool {
        uint256 month; // timestamp of month start
        uint256 totalFees;
        bool distributed;
    }

    mapping(uint256 => MonthlyPool) public monthlyPools;

    // Distribution percentages (in basis points, 10000 = 100%)
    uint256 public constant GAUNTLET_CHAMPIONS_BPS = 4000; // 40%
    uint256 public constant ARENA_CHAMPION_BPS = 3000;     // 30%
    uint256 public constant SPECIAL_EVENTS_BPS = 2000;     // 20%
    uint256 public constant PROTOCOL_BPS = 1000;           // 10%

    // Events
    event FeesReceived(address indexed from, uint256 amount);
    event MonthlyDistributed(uint256 indexed month, uint256 totalAmount);
    event RewardSent(address indexed recipient, uint256 amount, string reason);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Errors
    error OnlyOwner();
    error AlreadyDistributed();
    error TransferFailed();
    error InvalidAmount();
    error InvalidAddress();

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Receive ETH from protocol contracts
     * @dev Automatically adds to current month's pool
     */
    receive() external payable {
        if (msg.value == 0) revert InvalidAmount();
        currentMonthFees += msg.value;
        emit FeesReceived(msg.sender, msg.value);
    }

    /**
     * @notice Distribute monthly rewards to champions
     * @param month Month timestamp (start of month at 00:00 UTC)
     * @param gauntletWinners Array of top 10 gauntlet players
     * @param arenaChampion Top arena player address
     * @dev Distributes according to preset percentages
     */
    function distributeMonthly(
        uint256 month,
        address[10] calldata gauntletWinners,
        address arenaChampion
    ) external onlyOwner {
        if (monthlyPools[month].distributed) revert AlreadyDistributed();
        if (arenaChampion == address(0)) revert InvalidAddress();
        // FINDING-044: Prevent zero-fee distribution
        require(currentMonthFees > 0, "No fees to distribute");

        // Validate gauntlet winners
        for (uint256 i = 0; i < 10; i++) {
            if (gauntletWinners[i] == address(0)) revert InvalidAddress();
        }

        // Record this month's total
        uint256 totalToDistribute = currentMonthFees;
        monthlyPools[month] = MonthlyPool({
            month: month,
            totalFees: totalToDistribute,
            distributed: true
        });

        // Calculate pools
        uint256 gauntletPool = (totalToDistribute * GAUNTLET_CHAMPIONS_BPS) / 10000;
        uint256 arenaPool = (totalToDistribute * ARENA_CHAMPION_BPS) / 10000;
        // Note: eventsPool and protocolPool reserves calculated but not distributed yet
        // Will be implemented in future versions
        // uint256 eventsPool = (totalToDistribute * SPECIAL_EVENTS_BPS) / 10000;
        // uint256 protocolPool = (totalToDistribute * PROTOCOL_BPS) / 10000;

        // Distribute gauntlet rewards (top 10)
        // 1st: 20%, 2nd: 15%, 3rd: 10%, 4-10: 55% split
        uint256 first = (gauntletPool * 2000) / 10000;  // 20%
        uint256 second = (gauntletPool * 1500) / 10000; // 15%
        uint256 third = (gauntletPool * 1000) / 10000;  // 10%
        uint256 remaining = gauntletPool - first - second - third;
        uint256 perRemaining = remaining / 7; // Split among 4-10

        _sendReward(gauntletWinners[0], first, "Gauntlet 1st");
        _sendReward(gauntletWinners[1], second, "Gauntlet 2nd");
        _sendReward(gauntletWinners[2], third, "Gauntlet 3rd");

        for (uint256 i = 3; i < 10; i++) {
            _sendReward(gauntletWinners[i], perRemaining, "Gauntlet Top 10");
        }

        // Distribute arena reward
        _sendReward(arenaChampion, arenaPool, "Arena Champion");

        // Events pool stays in contract for manual distribution
        // Protocol pool stays in contract for operations

        // Reset current month fees
        currentMonthFees = 0;

        emit MonthlyDistributed(month, totalToDistribute);
    }

    /**
     * @notice Distribute special event rewards manually
     * @param recipient Reward recipient
     * @param amount Amount to send
     * @param reason Reason for reward (e.g., "Perfect Streak")
     */
    function distributeSpecialReward(
        address recipient,
        uint256 amount,
        string calldata reason
    ) external onlyOwner {
        if (recipient == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();
        if (amount > address(this).balance) revert InvalidAmount();

        _sendReward(recipient, amount, reason);
    }

    /**
     * @notice Transfer ownership to new address
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();

        address previousOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    /**
     * @notice Get current contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Get monthly pool info
     * @param month Month timestamp
     */
    function getMonthlyPool(uint256 month) external view returns (MonthlyPool memory) {
        return monthlyPools[month];
    }

    /**
     * @dev Internal function to send rewards
     */
    function _sendReward(address recipient, uint256 amount, string memory reason) private {
        (bool success, ) = recipient.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit RewardSent(recipient, amount, reason);
    }
}
