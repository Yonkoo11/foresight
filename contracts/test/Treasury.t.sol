// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Treasury.sol";

contract TreasuryTest is Test {
    Treasury public treasury;

    address public owner = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    address public user3 = address(0x3);
    address public user4 = address(0x4);
    address public user5 = address(0x5);
    address public user6 = address(0x6);
    address public user7 = address(0x7);
    address public user8 = address(0x8);
    address public user9 = address(0x9);
    address public user10 = address(0xA);
    address public arenaChampion = address(0xB);

    function setUp() public {
        treasury = new Treasury();

        // Fund test accounts
        vm.deal(owner, 100 ether);
        vm.deal(user1, 1 ether);
    }

    function testDeployment() public {
        assertEq(treasury.owner(), owner);
        assertEq(treasury.currentMonthFees(), 0);
    }

    function testReceiveFees() public {
        uint256 feeAmount = 1 ether;

        vm.expectEmit(true, false, false, true);
        emit Treasury.FeesReceived(address(this), feeAmount);

        (bool success, ) = address(treasury).call{value: feeAmount}("");
        assertTrue(success);

        assertEq(treasury.currentMonthFees(), feeAmount);
        assertEq(treasury.getBalance(), feeAmount);
    }

    function testCannotReceiveZeroFees() public {
        vm.expectRevert(Treasury.InvalidAmount.selector);
        (bool success, ) = address(treasury).call{value: 0}("");
        assertFalse(success);
    }

    function testDistributeMonthly() public {
        // Send fees to treasury
        (bool success, ) = address(treasury).call{value: 10 ether}("");
        assertTrue(success);

        uint256 month = block.timestamp;

        address[10] memory winners = [
            user1, user2, user3, user4, user5,
            user6, user7, user8, user9, user10
        ];

        // Get balances before
        uint256 user1BalBefore = user1.balance;
        uint256 user2BalBefore = user2.balance;
        uint256 user3BalBefore = user3.balance;

        vm.expectEmit(true, false, false, true);
        emit Treasury.MonthlyDistributed(month, 10 ether);

        treasury.distributeMonthly(month, winners, arenaChampion);

        // Check distribution happened
        Treasury.MonthlyPool memory pool = treasury.getMonthlyPool(month);
        assertTrue(pool.distributed);
        assertEq(pool.totalFees, 10 ether);

        // Check rewards received
        // Gauntlet pool = 40% of 10 ETH = 4 ETH
        // 1st: 20% of 4 ETH = 0.8 ETH
        // 2nd: 15% of 4 ETH = 0.6 ETH
        // 3rd: 10% of 4 ETH = 0.4 ETH

        assertEq(user1.balance - user1BalBefore, 0.8 ether);
        assertEq(user2.balance - user2BalBefore, 0.6 ether);
        assertEq(user3.balance - user3BalBefore, 0.4 ether);

        // Arena champion should get 30% of 10 ETH = 3 ETH
        assertEq(arenaChampion.balance, 3 ether);

        // Current month fees should be reset
        assertEq(treasury.currentMonthFees(), 0);
    }

    function testCannotDistributeTwice() public {
        (bool success, ) = address(treasury).call{value: 1 ether}("");
        assertTrue(success);

        uint256 month = block.timestamp;

        address[10] memory winners = [
            user1, user2, user3, user4, user5,
            user6, user7, user8, user9, user10
        ];

        treasury.distributeMonthly(month, winners, arenaChampion);

        // Try to distribute again
        vm.expectRevert(Treasury.AlreadyDistributed.selector);
        treasury.distributeMonthly(month, winners, arenaChampion);
    }

    function testCannotDistributeWithZeroAddress() public {
        (bool success, ) = address(treasury).call{value: 1 ether}("");
        assertTrue(success);

        uint256 month = block.timestamp;

        address[10] memory winners = [
            user1, user2, user3, user4, user5,
            user6, user7, user8, user9, user10
        ];

        // Try with zero arena champion
        vm.expectRevert(Treasury.InvalidAddress.selector);
        treasury.distributeMonthly(month, winners, address(0));

        // Try with zero in winners array
        winners[0] = address(0);
        vm.expectRevert(Treasury.InvalidAddress.selector);
        treasury.distributeMonthly(month, winners, arenaChampion);
    }

    function testOnlyOwnerCanDistribute() public {
        (bool success, ) = address(treasury).call{value: 1 ether}("");
        assertTrue(success);

        uint256 month = block.timestamp;

        address[10] memory winners = [
            user1, user2, user3, user4, user5,
            user6, user7, user8, user9, user10
        ];

        vm.prank(user1);
        vm.expectRevert(Treasury.OnlyOwner.selector);
        treasury.distributeMonthly(month, winners, arenaChampion);
    }

    function testSpecialRewardDistribution() public {
        (bool success, ) = address(treasury).call{value: 1 ether}("");
        assertTrue(success);

        uint256 rewardAmount = 0.1 ether;
        string memory reason = "Perfect 5/5 Streak";

        uint256 user1BalBefore = user1.balance;

        vm.expectEmit(true, false, false, true);
        emit Treasury.RewardSent(user1, rewardAmount, reason);

        treasury.distributeSpecialReward(user1, rewardAmount, reason);

        assertEq(user1.balance - user1BalBefore, rewardAmount);
    }

    function testCannotDistributeSpecialRewardAsNonOwner() public {
        (bool success, ) = address(treasury).call{value: 1 ether}("");
        assertTrue(success);

        vm.prank(user1);
        vm.expectRevert(Treasury.OnlyOwner.selector);
        treasury.distributeSpecialReward(user2, 0.1 ether, "Test");
    }

    function testCannotDistributeMoreThanBalance() public {
        (bool success, ) = address(treasury).call{value: 1 ether}("");
        assertTrue(success);

        vm.expectRevert(Treasury.InvalidAmount.selector);
        treasury.distributeSpecialReward(user1, 2 ether, "Too much");
    }

    function testTransferOwnership() public {
        assertEq(treasury.owner(), owner);

        vm.expectEmit(true, true, false, false);
        emit Treasury.OwnershipTransferred(owner, user1);

        treasury.transferOwnership(user1);

        assertEq(treasury.owner(), user1);
    }

    function testCannotTransferOwnershipToZeroAddress() public {
        vm.expectRevert(Treasury.InvalidAddress.selector);
        treasury.transferOwnership(address(0));
    }

    function testOnlyOwnerCanTransferOwnership() public {
        vm.prank(user1);
        vm.expectRevert(Treasury.OnlyOwner.selector);
        treasury.transferOwnership(user2);
    }

    function testGetBalance() public {
        assertEq(treasury.getBalance(), 0);

        (bool success, ) = address(treasury).call{value: 5 ether}("");
        assertTrue(success);

        assertEq(treasury.getBalance(), 5 ether);
    }

    function testAccumulateFeesOverTime() public {
        // Simulate multiple fee deposits
        (bool s1, ) = address(treasury).call{value: 1 ether}("");
        assertTrue(s1);
        assertEq(treasury.currentMonthFees(), 1 ether);

        (bool s2, ) = address(treasury).call{value: 2 ether}("");
        assertTrue(s2);
        assertEq(treasury.currentMonthFees(), 3 ether);

        (bool s3, ) = address(treasury).call{value: 0.5 ether}("");
        assertTrue(s3);
        assertEq(treasury.currentMonthFees(), 3.5 ether);
    }
}
