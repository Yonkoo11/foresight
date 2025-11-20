// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/DailyGauntlet.sol";
import "../src/ReputationEngine.sol";
import "../src/Treasury.sol";

contract DailyGauntletTest is Test {
    DailyGauntlet public gauntlet;
    ReputationEngine public reputation;
    Treasury public treasury;

    address public owner = address(this);
    address public oracle = address(0x1);
    address public keeper = address(0x2);
    address public user1 = address(0x3);
    address public user2 = address(0x4);
    address public user3 = address(0x5);

    function setUp() public {
        reputation = new ReputationEngine();
        treasury = new Treasury();
        gauntlet = new DailyGauntlet(address(reputation), address(treasury));

        gauntlet.setOracle(oracle);
        gauntlet.setKeeper(keeper);
        reputation.setContracts(address(0x6), address(gauntlet), address(0x7));
    }

    function testDeployment() public {
        assertEq(gauntlet.owner(), owner);
        assertEq(gauntlet.oracle(), oracle);
        assertEq(gauntlet.keeper(), keeper);
        assertEq(address(gauntlet.reputationEngine()), address(reputation));
        assertEq(address(gauntlet.treasury()), address(treasury));
        assertEq(gauntlet.currentDay(), 0);
    }

    function testCreatePrediction() public {
        uint256 resolutionTime = block.timestamp + 1 days;

        vm.prank(keeper);
        uint256 predictionId = gauntlet.createPrediction(
            "Will ETH hit $5000?",
            bytes32("ETH/USD"),
            resolutionTime
        );

        DailyGauntlet.Prediction memory prediction = gauntlet.getPrediction(predictionId);

        assertEq(prediction.id, predictionId);
        assertEq(prediction.question, "Will ETH hit $5000?");
        assertEq(prediction.oracleKey, bytes32("ETH/USD"));
        assertEq(prediction.resolutionTime, resolutionTime);
        assertFalse(prediction.resolved);
    }

    function testOnlyKeeperCanCreatePrediction() public {
        vm.prank(user1);
        vm.expectRevert(DailyGauntlet.OnlyKeeper.selector);

        gauntlet.createPrediction(
            "Question",
            bytes32("KEY"),
            block.timestamp + 1 days
        );
    }

    function testCreateGauntlet() public {
        // First create 5 predictions
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                string(abi.encodePacked("Question ", i)),
                bytes32(abi.encodePacked("KEY", i)),
                block.timestamp + 1 days
            );
        }

        assertEq(gauntlet.currentDay(), 0);

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        assertEq(gauntlet.currentDay(), 1);

        DailyGauntlet.Gauntlet memory g = gauntlet.getGauntlet(0);

        assertEq(g.day, 0);
        assertTrue(g.active);
        assertFalse(g.resolved);
        assertEq(g.predictionIds[0], predictionIds[0]);
        assertEq(g.predictionIds[4], predictionIds[4]);
    }

    function testOnlyKeeperCanCreateGauntlet() public {
        uint256[5] memory predictionIds;

        vm.prank(user1);
        vm.expectRevert(DailyGauntlet.OnlyKeeper.selector);
        gauntlet.createGauntlet(predictionIds);
    }

    function testSubmitEntry() public {
        // Create gauntlet
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                string(abi.encodePacked("Question ", i)),
                bytes32(abi.encodePacked("KEY", i)),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        // User submits entry
        bool[5] memory userPredictions = [true, false, true, false, true];

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        gauntlet.submitEntry{value: 0.1 ether}(userPredictions);

        DailyGauntlet.Entry memory entry = gauntlet.getEntry(user1, 0);

        assertEq(entry.user, user1);
        assertEq(entry.gauntletDay, 0);
        assertEq(entry.stake, 0.1 ether);
        assertEq(entry.predictions[0], true);
        assertEq(entry.predictions[1], false);
        assertEq(entry.predictions[2], true);
        assertFalse(entry.resolved);
        assertFalse(entry.claimed);

        DailyGauntlet.Gauntlet memory g = gauntlet.getGauntlet(0);
        assertEq(g.totalStaked, 0.1 ether);
        assertEq(g.entryCount, 1);
    }

    function testCannotSubmitEntryWithInsufficientStake() public {
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                "Question",
                bytes32("KEY"),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        bool[5] memory userPredictions = [true, false, true, false, true];

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        vm.expectRevert(DailyGauntlet.InvalidStake.selector);
        gauntlet.submitEntry{value: 0.005 ether}(userPredictions); // Below MIN_STAKE
    }

    function testCannotSubmitEntryTwice() public {
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                "Question",
                bytes32("KEY"),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        bool[5] memory userPredictions = [true, false, true, false, true];

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        gauntlet.submitEntry{value: 0.1 ether}(userPredictions);

        vm.prank(user1);
        vm.expectRevert(DailyGauntlet.AlreadyEntered.selector);
        gauntlet.submitEntry{value: 0.1 ether}(userPredictions);
    }

    function testResolvePrediction() public {
        vm.prank(keeper);
        uint256 predictionId = gauntlet.createPrediction(
            "Question",
            bytes32("KEY"),
            block.timestamp + 1 days
        );

        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(oracle);
        gauntlet.resolvePrediction(predictionId, true);

        DailyGauntlet.Prediction memory prediction = gauntlet.getPrediction(predictionId);

        assertTrue(prediction.resolved);
        assertTrue(prediction.outcome);
    }

    function testOnlyOracleCanResolvePrediction() public {
        vm.prank(keeper);
        uint256 predictionId = gauntlet.createPrediction(
            "Question",
            bytes32("KEY"),
            block.timestamp + 1 days
        );

        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(user1);
        vm.expectRevert(DailyGauntlet.OnlyOracle.selector);
        gauntlet.resolvePrediction(predictionId, true);
    }

    function testResolveGauntlet() public {
        // Create gauntlet
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                string(abi.encodePacked("Question ", i)),
                bytes32(abi.encodePacked("KEY", i)),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        // User submits entry (all YES)
        bool[5] memory userPredictions = [true, true, true, true, true];

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        gauntlet.submitEntry{value: 0.1 ether}(userPredictions);

        vm.warp(block.timestamp + 1 days + 1);

        // Resolve all predictions (3 YES, 2 NO)
        vm.startPrank(oracle);
        gauntlet.resolvePrediction(predictionIds[0], true);  // Correct
        gauntlet.resolvePrediction(predictionIds[1], true);  // Correct
        gauntlet.resolvePrediction(predictionIds[2], false); // Wrong
        gauntlet.resolvePrediction(predictionIds[3], true);  // Correct
        gauntlet.resolvePrediction(predictionIds[4], false); // Wrong
        vm.stopPrank();

        // Resolve gauntlet
        gauntlet.resolveGauntlet(0);

        DailyGauntlet.Gauntlet memory g = gauntlet.getGauntlet(0);
        assertTrue(g.resolved);
        assertFalse(g.active);

        DailyGauntlet.Entry memory entry = gauntlet.getEntry(user1, 0);
        assertTrue(entry.resolved);
        assertEq(entry.correctCount, 3); // Got 3/5 correct
    }

    function testCannotResolveGauntletIfPredictionsNotResolved() public {
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                "Question",
                bytes32("KEY"),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        vm.warp(block.timestamp + 1 days + 1);

        // Only resolve 4 out of 5 predictions
        vm.startPrank(oracle);
        gauntlet.resolvePrediction(predictionIds[0], true);
        gauntlet.resolvePrediction(predictionIds[1], true);
        gauntlet.resolvePrediction(predictionIds[2], false);
        gauntlet.resolvePrediction(predictionIds[3], true);
        // predictionIds[4] not resolved
        vm.stopPrank();

        vm.expectRevert(DailyGauntlet.PredictionNotResolved.selector);
        gauntlet.resolveGauntlet(0);
    }

    function testClaimRewardFor5Correct() public {
        // Setup gauntlet with multiple users
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                "Question",
                bytes32("KEY"),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        // User1: 5/5 correct
        bool[5] memory user1Predictions = [true, true, true, true, true];
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        gauntlet.submitEntry{value: 0.1 ether}(user1Predictions);

        // User2: 3/5 correct
        bool[5] memory user2Predictions = [true, true, true, false, false];
        vm.deal(user2, 1 ether);
        vm.prank(user2);
        gauntlet.submitEntry{value: 0.1 ether}(user2Predictions);

        vm.warp(block.timestamp + 1 days + 1);

        // Resolve all predictions as YES
        vm.startPrank(oracle);
        for (uint256 i = 0; i < 5; i++) {
            gauntlet.resolvePrediction(predictionIds[i], true);
        }
        vm.stopPrank();

        gauntlet.resolveGauntlet(0);

        uint256 user1BalanceBefore = user1.balance;

        // User1 claims reward
        vm.prank(user1);
        gauntlet.claimReward(0);

        // Total pool: 0.2 ETH
        // Protocol fee (2%): 0.004 ETH
        // Reward pool: 0.196 ETH
        // 5/5 tier gets 50% = 0.098 ETH
        // User1 is the only 5/5, so gets full 0.098 ETH
        uint256 expectedReward = 0.098 ether;
        assertEq(user1.balance, user1BalanceBefore + expectedReward);
    }

    function testClaimRewardFor3Correct() public {
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                "Question",
                bytes32("KEY"),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        // User1: 3/5 correct
        bool[5] memory user1Predictions = [true, true, true, false, false];
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        gauntlet.submitEntry{value: 0.1 ether}(user1Predictions);

        vm.warp(block.timestamp + 1 days + 1);

        // Resolve: first 3 YES, last 2 NO
        vm.startPrank(oracle);
        gauntlet.resolvePrediction(predictionIds[0], true);
        gauntlet.resolvePrediction(predictionIds[1], true);
        gauntlet.resolvePrediction(predictionIds[2], true);
        gauntlet.resolvePrediction(predictionIds[3], false);
        gauntlet.resolvePrediction(predictionIds[4], false);
        vm.stopPrank();

        gauntlet.resolveGauntlet(0);

        uint256 user1BalanceBefore = user1.balance;

        vm.prank(user1);
        gauntlet.claimReward(0);

        // Reward pool: 0.098 ETH (after 2% fee)
        // 3/5 tier gets 15% = 0.0147 ETH
        // User1 is the only 3/5, so gets full amount
        uint256 expectedReward = 0.0147 ether;
        assertEq(user1.balance, user1BalanceBefore + expectedReward);
    }

    function testCannotClaimRewardForLessThan3Correct() public {
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                "Question",
                bytes32("KEY"),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        // User1: 2/5 correct (all NO, but 3 predictions are YES)
        bool[5] memory user1Predictions = [false, false, false, false, false];
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        gauntlet.submitEntry{value: 0.1 ether}(user1Predictions);

        vm.warp(block.timestamp + 1 days + 1);

        vm.startPrank(oracle);
        gauntlet.resolvePrediction(predictionIds[0], true);
        gauntlet.resolvePrediction(predictionIds[1], true);
        gauntlet.resolvePrediction(predictionIds[2], true);
        gauntlet.resolvePrediction(predictionIds[3], false); // Correct
        gauntlet.resolvePrediction(predictionIds[4], false); // Correct
        vm.stopPrank();

        gauntlet.resolveGauntlet(0);

        vm.prank(user1);
        vm.expectRevert(DailyGauntlet.NoPayout.selector);
        gauntlet.claimReward(0);
    }

    function testCannotClaimRewardTwice() public {
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                "Question",
                bytes32("KEY"),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        bool[5] memory user1Predictions = [true, true, true, true, true];
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        gauntlet.submitEntry{value: 0.1 ether}(user1Predictions);

        vm.warp(block.timestamp + 1 days + 1);

        vm.startPrank(oracle);
        for (uint256 i = 0; i < 5; i++) {
            gauntlet.resolvePrediction(predictionIds[i], true);
        }
        vm.stopPrank();

        gauntlet.resolveGauntlet(0);

        vm.prank(user1);
        gauntlet.claimReward(0);

        vm.prank(user1);
        vm.expectRevert(DailyGauntlet.AlreadyClaimed.selector);
        gauntlet.claimReward(0);
    }

    function testProportionalPayoutDistribution() public {
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                "Question",
                bytes32("KEY"),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        // User1: 5/5 correct
        bool[5] memory user1Predictions = [true, true, true, true, true];
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        gauntlet.submitEntry{value: 0.1 ether}(user1Predictions);

        // User2: 4/5 correct
        bool[5] memory user2Predictions = [true, true, true, true, false];
        vm.deal(user2, 1 ether);
        vm.prank(user2);
        gauntlet.submitEntry{value: 0.1 ether}(user2Predictions);

        // User3: 3/5 correct
        bool[5] memory user3Predictions = [true, true, true, false, false];
        vm.deal(user3, 1 ether);
        vm.prank(user3);
        gauntlet.submitEntry{value: 0.1 ether}(user3Predictions);

        vm.warp(block.timestamp + 1 days + 1);

        vm.startPrank(oracle);
        for (uint256 i = 0; i < 5; i++) {
            gauntlet.resolvePrediction(predictionIds[i], true);
        }
        vm.stopPrank();

        gauntlet.resolveGauntlet(0);

        uint256 user1BalanceBefore = user1.balance;
        uint256 user2BalanceBefore = user2.balance;
        uint256 user3BalanceBefore = user3.balance;

        vm.prank(user1);
        gauntlet.claimReward(0);

        vm.prank(user2);
        gauntlet.claimReward(0);

        vm.prank(user3);
        gauntlet.claimReward(0);

        // Total: 0.3 ETH
        // Fee (2%): 0.006 ETH
        // Reward pool: 0.294 ETH
        // 5/5 (50%): 0.147 ETH → User1 gets full amount
        // 4/5 (35%): 0.1029 ETH → User2 gets full amount
        // 3/5 (15%): 0.0441 ETH → User3 gets full amount

        assertEq(user1.balance, user1BalanceBefore + 0.147 ether);
        assertEq(user2.balance, user2BalanceBefore + 0.1029 ether);
        assertEq(user3.balance, user3BalanceBefore + 0.0441 ether);
    }

    function testGetParticipants() public {
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                "Question",
                bytes32("KEY"),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        bool[5] memory predictions = [true, true, true, true, true];

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        gauntlet.submitEntry{value: 0.1 ether}(predictions);

        vm.deal(user2, 1 ether);
        vm.prank(user2);
        gauntlet.submitEntry{value: 0.1 ether}(predictions);

        address[] memory participants = gauntlet.getParticipants(0);

        assertEq(participants.length, 2);
        assertEq(participants[0], user1);
        assertEq(participants[1], user2);
    }

    function testSetOracle() public {
        address newOracle = address(0x999);
        gauntlet.setOracle(newOracle);
        assertEq(gauntlet.oracle(), newOracle);
    }

    function testOnlyOwnerCanSetOracle() public {
        vm.prank(user1);
        vm.expectRevert(DailyGauntlet.OnlyOwner.selector);
        gauntlet.setOracle(address(0x999));
    }

    function testSetKeeper() public {
        address newKeeper = address(0x999);
        gauntlet.setKeeper(newKeeper);
        assertEq(gauntlet.keeper(), newKeeper);
    }

    function testOnlyOwnerCanSetKeeper() public {
        vm.prank(user1);
        vm.expectRevert(DailyGauntlet.OnlyOwner.selector);
        gauntlet.setKeeper(address(0x999));
    }

    function testTransferOwnership() public {
        gauntlet.transferOwnership(user1);
        assertEq(gauntlet.owner(), user1);
    }

    function testTreasuryReceivesFees() public {
        uint256[5] memory predictionIds;
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(keeper);
            predictionIds[i] = gauntlet.createPrediction(
                "Question",
                bytes32("KEY"),
                block.timestamp + 1 days
            );
        }

        vm.prank(keeper);
        gauntlet.createGauntlet(predictionIds);

        bool[5] memory predictions = [true, true, true, true, true];
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        gauntlet.submitEntry{value: 0.1 ether}(predictions);

        vm.warp(block.timestamp + 1 days + 1);

        vm.startPrank(oracle);
        for (uint256 i = 0; i < 5; i++) {
            gauntlet.resolvePrediction(predictionIds[i], true);
        }
        vm.stopPrank();

        gauntlet.resolveGauntlet(0);

        uint256 treasuryBalanceBefore = address(treasury).balance;

        vm.prank(user1);
        gauntlet.claimReward(0);

        // Treasury should receive 2% of 0.1 ETH = 0.002 ETH
        assertEq(address(treasury).balance, treasuryBalanceBefore + 0.002 ether);
    }
}
