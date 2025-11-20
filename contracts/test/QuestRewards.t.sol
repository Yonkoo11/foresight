// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/QuestRewards.sol";
import "../src/Treasury.sol";
import "../src/ReputationEngine.sol";

contract QuestRewardsTest is Test {
    QuestRewards public questRewards;
    Treasury public treasury;
    ReputationEngine public reputationEngine;

    address public owner = address(1);
    address public backend = address(2);
    address public user1 = address(3);
    address public user2 = address(4);

    function setUp() public {
        vm.startPrank(owner);

        // Deploy contracts
        treasury = new Treasury();
        reputationEngine = new ReputationEngine();
        questRewards = new QuestRewards(address(treasury), address(reputationEngine));

        // Setup
        questRewards.setBackend(backend);
        questRewards.allocateMonthlyBudget(202501, 5 ether);

        // Fund contract
        vm.deal(address(questRewards), 10 ether);

        vm.stopPrank();
    }

    function testRegisterQuest() public {
        vm.prank(backend);
        questRewards.registerQuest(1, 100);

        assertTrue(questRewards.questExists(1));
        assertEq(questRewards.questMaxCompletions(1), 100);
    }

    function testAwardQuestReward() public {
        vm.prank(backend);
        questRewards.registerQuest(1, 100);

        vm.prank(backend);
        questRewards.awardQuestReward(user1, 1, 0.01 ether, true);

        uint256 pending = questRewards.getPendingRewards(user1);
        assertEq(pending, 0.01 ether);
    }

    function testClaimVestedRewards() public {
        vm.prank(backend);
        questRewards.registerQuest(1, 100);

        vm.prank(backend);
        questRewards.awardQuestReward(user1, 1, 0.01 ether, true);

        // Fast forward 7 days
        vm.warp(block.timestamp + 7 days);

        uint256 balanceBefore = user1.balance;

        vm.prank(user1);
        questRewards.claimVestedRewards();

        uint256 balanceAfter = user1.balance;
        assertEq(balanceAfter - balanceBefore, 0.01 ether);
    }

    function testDailyWithdrawalLimit() public {
        vm.prank(backend);
        questRewards.registerQuest(1, 100);

        // Award 0.15 ETH (exceeds daily limit)
        vm.prank(backend);
        questRewards.awardQuestReward(user1, 1, 0.15 ether, false);

        // Should revert due to daily limit (0.1 ETH max)
        vm.prank(user1);
        vm.expectRevert(QuestRewards.DailyLimitExceeded.selector);
        questRewards.claimVestedRewards();
    }

    function testMonthlyBudgetCap() public {
        vm.prank(backend);
        questRewards.registerQuest(1, 100);

        // Allocate 5 ETH budget
        // Try to award 6 ETH (should reduce to available)
        vm.prank(backend);
        questRewards.awardQuestReward(user1, 1, 6 ether, false);

        // Should only receive what's available in budget
        uint256 claimable = questRewards.getClaimableRewards(user1);
        assertLe(claimable, 5 ether);
    }

    function testQuestCompletionCap() public {
        vm.prank(backend);
        questRewards.registerQuest(1, 2); // Max 2 completions

        vm.prank(backend);
        questRewards.awardQuestReward(user1, 1, 0.01 ether, false);

        vm.prank(backend);
        questRewards.awardQuestReward(user2, 1, 0.01 ether, false);

        // Third completion should fail
        vm.prank(backend);
        vm.expectRevert(QuestRewards.QuestNotActive.selector);
        questRewards.awardQuestReward(user1, 1, 0.01 ether, false);
    }

    function testUserFlag() public {
        vm.prank(backend);
        questRewards.flagUser(user1, "Suspicious activity");

        assertTrue(questRewards.userEligibility(user1).flagged);

        // Flagged user cannot claim
        vm.prank(backend);
        questRewards.registerQuest(1, 100);

        vm.prank(backend);
        vm.expectRevert(QuestRewards.UserFlagged.selector);
        questRewards.awardQuestReward(user1, 1, 0.01 ether, false);
    }

    function testUnflagUser() public {
        vm.prank(backend);
        questRewards.flagUser(user1, "Test");

        vm.prank(owner);
        questRewards.unflagUser(user1);

        assertFalse(questRewards.userEligibility(user1).flagged);
    }

    receive() external payable {}
}
