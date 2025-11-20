// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TimecasterArena.sol";
import "../src/ReputationEngine.sol";
import "../src/Treasury.sol";

contract TimecasterArenaTest is Test {
    TimecasterArena public arena;
    ReputationEngine public reputation;
    Treasury public treasury;

    address public owner = address(this);
    address public oracle = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public user3 = address(0x4);

    function setUp() public {
        reputation = new ReputationEngine();
        treasury = new Treasury();
        arena = new TimecasterArena(address(reputation), address(treasury));

        arena.setOracle(oracle);
        reputation.setContracts(address(arena), address(0x5), address(0x6));
    }

    function testDeployment() public {
        assertEq(arena.owner(), owner);
        assertEq(arena.oracle(), oracle);
        assertEq(address(arena.reputationEngine()), address(reputation));
        assertEq(address(arena.treasury()), address(treasury));
    }

    function testCreatePriceDuel() public {
        uint256 resolutionTime = block.timestamp + 1 days;

        vm.deal(user1, 1 ether);
        vm.prank(user1);

        uint256 duelId = arena.createPriceDuel{value: 0.1 ether}(
            "Will ETH hit $5000 by tomorrow?",
            "YES",
            bytes32("ETH/USD"),
            500000000000, // $5000 in 8 decimals
            resolutionTime
        );

        TimecasterArena.Duel memory duel = arena.getDuel(duelId);

        assertEq(duel.id, duelId);
        assertEq(duel.creator, user1);
        assertEq(uint256(duel.duelType), uint256(TimecasterArena.DuelType.PRICE));
        assertEq(uint256(duel.status), uint256(TimecasterArena.DuelStatus.PENDING));
        assertEq(duel.stake, 0.1 ether);
        assertEq(duel.resolutionTime, resolutionTime);
        assertEq(duel.oracleKey, bytes32("ETH/USD"));
        assertEq(duel.targetPrice, 500000000000);
    }

    function testCreateProtocolDuel() public {
        uint256 resolutionTime = block.timestamp + 1 days;

        vm.deal(user1, 1 ether);
        vm.prank(user1);

        uint256 duelId = arena.createProtocolDuel{value: 0.1 ether}(
            "Will Base TVL exceed $1B?",
            "YES",
            "BASE_TVL",
            1000000000,
            resolutionTime
        );

        TimecasterArena.Duel memory duel = arena.getDuel(duelId);

        assertEq(uint256(duel.duelType), uint256(TimecasterArena.DuelType.PROTOCOL));
        assertEq(duel.protocolMetric, "BASE_TVL");
        assertEq(duel.targetValue, 1000000000);
    }

    function testCreateNarrativeDuel() public {
        uint256 votingEndsAt = block.timestamp + 2 days;

        vm.deal(user1, 1 ether);
        vm.prank(user1);

        uint256 duelId = arena.createNarrativeDuel{value: 0.1 ether}(
            "Will @elonmusk tweet about Doge?",
            "YES",
            votingEndsAt
        );

        TimecasterArena.Duel memory duel = arena.getDuel(duelId);

        assertEq(uint256(duel.duelType), uint256(TimecasterArena.DuelType.NARRATIVE));
        assertEq(duel.resolutionTime, votingEndsAt);
    }

    function testCannotCreateDuelWithZeroStake() public {
        vm.prank(user1);
        vm.expectRevert(TimecasterArena.InvalidStake.selector);

        arena.createPriceDuel{value: 0}(
            "Question",
            "YES",
            bytes32("ETH/USD"),
            500000000000,
            block.timestamp + 1 days
        );
    }

    function testCannotCreateDuelWithPastResolutionTime() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        vm.expectRevert(TimecasterArena.InvalidDuelType.selector);

        arena.createPriceDuel{value: 0.1 ether}(
            "Question",
            "YES",
            bytes32("ETH/USD"),
            500000000000,
            block.timestamp - 1 // Past time
        );
    }

    function testAcceptDuel() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createPriceDuel{value: 0.1 ether}(
            "Will ETH hit $5000?",
            "YES",
            bytes32("ETH/USD"),
            500000000000,
            block.timestamp + 1 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        TimecasterArena.Duel memory duel = arena.getDuel(duelId);

        assertEq(duel.opponent, user2);
        assertEq(uint256(duel.status), uint256(TimecasterArena.DuelStatus.ACTIVE));
        assertGt(duel.acceptedAt, 0);
    }

    function testAcceptNarrativeDuelOpensVoting() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createNarrativeDuel{value: 0.1 ether}(
            "Will Elon tweet?",
            "YES",
            block.timestamp + 2 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        TimecasterArena.Duel memory duel = arena.getDuel(duelId);
        assertEq(uint256(duel.status), uint256(TimecasterArena.DuelStatus.VOTING));
    }

    function testCannotAcceptOwnDuel() public {
        vm.deal(user1, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createPriceDuel{value: 0.1 ether}(
            "Question",
            "YES",
            bytes32("ETH/USD"),
            500000000000,
            block.timestamp + 1 days
        );

        vm.prank(user1);
        vm.expectRevert(TimecasterArena.CannotAcceptOwnDuel.selector);
        arena.acceptDuel{value: 0.1 ether}(duelId);
    }

    function testCannotAcceptWithWrongStake() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createPriceDuel{value: 0.1 ether}(
            "Question",
            "YES",
            bytes32("ETH/USD"),
            500000000000,
            block.timestamp + 1 days
        );

        vm.prank(user2);
        vm.expectRevert(TimecasterArena.InvalidStake.selector);
        arena.acceptDuel{value: 0.05 ether}(duelId); // Wrong amount
    }

    function testCannotAcceptExpiredDuel() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createPriceDuel{value: 0.1 ether}(
            "Question",
            "YES",
            bytes32("ETH/USD"),
            500000000000,
            block.timestamp + 1 days
        );

        // Fast forward past accept deadline
        vm.warp(block.timestamp + 49 hours);

        vm.prank(user2);
        vm.expectRevert(TimecasterArena.DuelExpired.selector);
        arena.acceptDuel{value: 0.1 ether}(duelId);
    }

    function testCancelDuel() public {
        vm.deal(user1, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createPriceDuel{value: 0.1 ether}(
            "Question",
            "YES",
            bytes32("ETH/USD"),
            500000000000,
            block.timestamp + 1 days
        );

        uint256 balanceBefore = user1.balance;

        // Fast forward past accept deadline
        vm.warp(block.timestamp + 49 hours);

        vm.prank(user1);
        arena.cancelDuel(duelId);

        TimecasterArena.Duel memory duel = arena.getDuel(duelId);
        assertEq(uint256(duel.status), uint256(TimecasterArena.DuelStatus.CANCELLED));

        // Check refund
        assertEq(user1.balance, balanceBefore + 0.1 ether);
    }

    function testCannotCancelBeforeExpiry() public {
        vm.deal(user1, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createPriceDuel{value: 0.1 ether}(
            "Question",
            "YES",
            bytes32("ETH/USD"),
            500000000000,
            block.timestamp + 1 days
        );

        vm.prank(user1);
        vm.expectRevert(TimecasterArena.DuelNotExpired.selector);
        arena.cancelDuel(duelId);
    }

    function testResolvePriceDuel() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createPriceDuel{value: 0.1 ether}(
            "Question",
            "YES",
            bytes32("ETH/USD"),
            500000000000,
            block.timestamp + 1 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        uint256 user1BalanceBefore = user1.balance;

        // Fast forward to resolution time
        vm.warp(block.timestamp + 1 days + 1);

        // Oracle resolves: creator wins
        vm.prank(oracle);
        arena.resolveDuel(duelId, true);

        TimecasterArena.Duel memory duel = arena.getDuel(duelId);

        assertTrue(duel.resolved);
        assertEq(duel.winner, user1);
        assertEq(uint256(duel.status), uint256(TimecasterArena.DuelStatus.RESOLVED));

        // Check payout: 0.2 ETH total, 5% fee = 0.01 ETH, winner gets 0.19 ETH
        assertEq(user1.balance, user1BalanceBefore + 0.19 ether);
    }

    function testResolveProtocolDuel() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createProtocolDuel{value: 0.1 ether}(
            "Question",
            "YES",
            "BASE_TVL",
            1000000000,
            block.timestamp + 1 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        uint256 user2BalanceBefore = user2.balance;

        vm.warp(block.timestamp + 1 days + 1);

        // Oracle resolves: opponent wins
        vm.prank(oracle);
        arena.resolveDuel(duelId, false);

        TimecasterArena.Duel memory duel = arena.getDuel(duelId);

        assertEq(duel.winner, user2);
        assertEq(user2.balance, user2BalanceBefore + 0.19 ether);
    }

    function testOnlyOracleCanResolve() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createPriceDuel{value: 0.1 ether}(
            "Question",
            "YES",
            bytes32("ETH/USD"),
            500000000000,
            block.timestamp + 1 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(user1);
        vm.expectRevert(TimecasterArena.OnlyOracle.selector);
        arena.resolveDuel(duelId, true);
    }

    function testVoteOnNarrativeDuel() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
        vm.deal(user3, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createNarrativeDuel{value: 0.1 ether}(
            "Question",
            "YES",
            block.timestamp + 2 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        // User3 votes for creator
        vm.prank(user3);
        arena.vote{value: 0.01 ether}(duelId, true);

        TimecasterArena.Vote[] memory votes = arena.getVotes(duelId);

        assertEq(votes.length, 1);
        assertEq(votes[0].voter, user3);
        assertTrue(votes[0].votedForCreator);
        assertEq(votes[0].stake, 0.01 ether);
    }

    function testCannotVoteWithWrongStake() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
        vm.deal(user3, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createNarrativeDuel{value: 0.1 ether}(
            "Question",
            "YES",
            block.timestamp + 2 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        vm.prank(user3);
        vm.expectRevert(TimecasterArena.InsufficientVoteStake.selector);
        arena.vote{value: 0.005 ether}(duelId, true);
    }

    function testCannotVoteTwice() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
        vm.deal(user3, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createNarrativeDuel{value: 0.1 ether}(
            "Question",
            "YES",
            block.timestamp + 2 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        vm.prank(user3);
        arena.vote{value: 0.01 ether}(duelId, true);

        vm.prank(user3);
        vm.expectRevert(TimecasterArena.AlreadyVoted.selector);
        arena.vote{value: 0.01 ether}(duelId, false);
    }

    function testResolveNarrativeDuel() public {
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);

        vm.prank(user1);
        uint256 duelId = arena.createNarrativeDuel{value: 0.1 ether}(
            "Question",
            "YES",
            block.timestamp + 2 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        // Get 10 voters
        for (uint160 i = 100; i < 110; i++) {
            address voter = address(i);
            vm.deal(voter, 1 ether);
            vm.prank(voter);
            // First 6 vote for creator, last 4 vote for opponent
            arena.vote{value: 0.01 ether}(duelId, i < 106);
        }

        vm.warp(block.timestamp + 2 days + 1);

        uint256 user1BalanceBefore = user1.balance;

        arena.resolveNarrativeDuel(duelId);

        TimecasterArena.Duel memory duel = arena.getDuel(duelId);

        // Creator should win (6 votes vs 4)
        assertEq(duel.winner, user1);
        assertEq(user1.balance, user1BalanceBefore + 0.19 ether);
    }

    function testCannotResolveNarrativeWithTooFewVotes() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createNarrativeDuel{value: 0.1 ether}(
            "Question",
            "YES",
            block.timestamp + 2 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        // Only 3 votes (need 10)
        for (uint160 i = 100; i < 103; i++) {
            address voter = address(i);
            vm.deal(voter, 1 ether);
            vm.prank(voter);
            arena.vote{value: 0.01 ether}(duelId, true);
        }

        vm.warp(block.timestamp + 2 days + 1);

        vm.expectRevert(TimecasterArena.NotEnoughVotes.selector);
        arena.resolveNarrativeDuel(duelId);
    }

    function testClaimVoteReward() public {
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);

        vm.prank(user1);
        uint256 duelId = arena.createNarrativeDuel{value: 0.1 ether}(
            "Question",
            "YES",
            block.timestamp + 2 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        // 6 vote correctly, 4 vote incorrectly
        for (uint160 i = 100; i < 110; i++) {
            address voter = address(i);
            vm.deal(voter, 1 ether);
            vm.prank(voter);
            arena.vote{value: 0.01 ether}(duelId, i < 106);
        }

        vm.warp(block.timestamp + 2 days + 1);
        arena.resolveNarrativeDuel(duelId);

        // Correct voter claims reward
        address correctVoter = address(100);
        uint256 balanceBefore = correctVoter.balance;

        vm.prank(correctVoter);
        arena.claimVoteReward(duelId);

        // Should get: 0.01 (original) + (0.04 / 6) = 0.01 + 0.00666... ≈ 0.016666 ether
        // 0.04 ether = 40000000000000000 wei, 40000000000000000 / 6 = 6666666666666666 wei
        uint256 expectedReward = 0.01 ether + 6666666666666666;
        assertEq(correctVoter.balance, balanceBefore + expectedReward);
    }

    function testIncorrectVoterCannotClaimReward() public {
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);

        vm.prank(user1);
        uint256 duelId = arena.createNarrativeDuel{value: 0.1 ether}(
            "Question",
            "YES",
            block.timestamp + 2 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        for (uint160 i = 100; i < 110; i++) {
            address voter = address(i);
            vm.deal(voter, 1 ether);
            vm.prank(voter);
            arena.vote{value: 0.01 ether}(duelId, i < 106);
        }

        vm.warp(block.timestamp + 2 days + 1);
        arena.resolveNarrativeDuel(duelId);

        // Incorrect voter tries to claim
        address incorrectVoter = address(107); // Voted for opponent

        vm.prank(incorrectVoter);
        vm.expectRevert(TimecasterArena.NoRewardToClaim.selector);
        arena.claimVoteReward(duelId);
    }

    function testSetOracle() public {
        address newOracle = address(0x999);
        arena.setOracle(newOracle);
        assertEq(arena.oracle(), newOracle);
    }

    function testOnlyOwnerCanSetOracle() public {
        vm.prank(user1);
        vm.expectRevert(TimecasterArena.OnlyOwner.selector);
        arena.setOracle(address(0x999));
    }

    function testTransferOwnership() public {
        arena.transferOwnership(user1);
        assertEq(arena.owner(), user1);
    }

    function testTreasuryReceivesFees() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);

        vm.prank(user1);
        uint256 duelId = arena.createPriceDuel{value: 0.1 ether}(
            "Question",
            "YES",
            bytes32("ETH/USD"),
            500000000000,
            block.timestamp + 1 days
        );

        vm.prank(user2);
        arena.acceptDuel{value: 0.1 ether}(duelId);

        uint256 treasuryBalanceBefore = address(treasury).balance;

        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(oracle);
        arena.resolveDuel(duelId, true);

        // Treasury should receive 5% of 0.2 ETH = 0.01 ETH
        assertEq(address(treasury).balance, treasuryBalanceBefore + 0.01 ether);
    }
}
