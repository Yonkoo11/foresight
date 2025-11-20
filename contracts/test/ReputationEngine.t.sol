// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/ReputationEngine.sol";

contract ReputationEngineTest is Test {
    ReputationEngine public reputation;

    address public owner = address(this);
    address public arena = address(0x1);
    address public gauntlet = address(0x2);
    address public draft = address(0x3);
    address public keeper = address(0x4);
    address public user1 = address(0x5);
    address public user2 = address(0x6);

    function setUp() public {
        reputation = new ReputationEngine();

        // Set contracts
        reputation.setContracts(arena, gauntlet, draft);
        reputation.setKeeper(keeper);
        reputation.setTotalPlayers(100);
    }

    function testDeployment() public {
        assertEq(reputation.owner(), owner);
        assertEq(reputation.timecasterArena(), arena);
        assertEq(reputation.dailyGauntlet(), gauntlet);
        assertEq(reputation.ctDraft(), draft);
        assertEq(reputation.keeper(), keeper);
    }

    function testSetContracts() public {
        ReputationEngine newRep = new ReputationEngine();

        vm.expectEmit(false, false, false, true);
        emit ReputationEngine.ContractsSet(arena, gauntlet, draft);

        newRep.setContracts(arena, gauntlet, draft);

        assertEq(newRep.timecasterArena(), arena);
        assertEq(newRep.dailyGauntlet(), gauntlet);
        assertEq(newRep.ctDraft(), draft);
    }

    function testCannotSetContractsWithZeroAddress() public {
        ReputationEngine newRep = new ReputationEngine();

        vm.expectRevert(ReputationEngine.InvalidAddress.selector);
        newRep.setContracts(address(0), gauntlet, draft);

        vm.expectRevert(ReputationEngine.InvalidAddress.selector);
        newRep.setContracts(arena, address(0), draft);

        vm.expectRevert(ReputationEngine.InvalidAddress.selector);
        newRep.setContracts(arena, gauntlet, address(0));
    }

    function testOnlyOwnerCanSetContracts() public {
        vm.prank(user1);
        vm.expectRevert(ReputationEngine.OnlyOwner.selector);
        reputation.setContracts(arena, gauntlet, draft);
    }

    function testSetKeeper() public {
        address newKeeper = address(0x7);

        vm.expectEmit(true, false, false, false);
        emit ReputationEngine.KeeperUpdated(newKeeper);

        reputation.setKeeper(newKeeper);

        assertEq(reputation.keeper(), newKeeper);
    }

    function testUpdateDuelStats() public {
        uint256 stake = 0.1 ether;

        vm.prank(arena);
        reputation.updateDuelStats(user1, user2, stake);

        ReputationEngine.UserReputation memory user1Rep = reputation.getReputation(user1);
        ReputationEngine.UserReputation memory user2Rep = reputation.getReputation(user2);

        // Check winner (user1)
        assertEq(user1Rep.arenaWins, 1);
        assertEq(user1Rep.arenaLosses, 0);
        assertEq(user1Rep.totalStaked, stake);
        assertEq(user1Rep.totalWinnings, (stake * 2 * 95) / 100);

        // Check loser (user2)
        assertEq(user2Rep.arenaWins, 0);
        assertEq(user2Rep.arenaLosses, 1);
        assertEq(user2Rep.totalStaked, stake);
        assertEq(user2Rep.totalWinnings, 0);
    }

    function testOnlyArenaCanUpdateDuelStats() public {
        vm.expectRevert(ReputationEngine.OnlyArena.selector);
        reputation.updateDuelStats(user1, user2, 0.1 ether);

        vm.prank(user1);
        vm.expectRevert(ReputationEngine.OnlyArena.selector);
        reputation.updateDuelStats(user1, user2, 0.1 ether);
    }

    function testUpdateGauntletStats() public {
        vm.prank(gauntlet);
        reputation.updateGauntletStats(user1, 4); // 4 out of 5 correct

        ReputationEngine.UserReputation memory rep = reputation.getReputation(user1);

        assertEq(rep.gauntletDays, 1);
        assertEq(rep.totalCorrect, 4);
        assertEq(rep.totalPredictions, 5);
    }

    function testOnlyGauntletCanUpdateGauntletStats() public {
        vm.expectRevert(ReputationEngine.OnlyGauntlet.selector);
        reputation.updateGauntletStats(user1, 4);

        vm.prank(user1);
        vm.expectRevert(ReputationEngine.OnlyGauntlet.selector);
        reputation.updateGauntletStats(user1, 4);
    }

    function testUpdateOffChainStats() public {
        uint256 draftRank = 10;
        uint256 draftScore = 5000;
        uint256 ctIQ = 85;
        uint256 streak = 15;

        vm.prank(keeper);
        reputation.updateOffChainStats(user1, draftRank, draftScore, ctIQ, streak);

        ReputationEngine.UserReputation memory rep = reputation.getReputation(user1);

        assertEq(rep.draftRank, draftRank);
        assertEq(rep.draftScore, draftScore);
        assertEq(rep.ctIQ, ctIQ);
        assertEq(rep.whispererStreak, streak);
    }

    function testCtIQCappedAt100() public {
        vm.prank(keeper);
        reputation.updateOffChainStats(user1, 1, 1000, 150, 5); // ctIQ = 150

        ReputationEngine.UserReputation memory rep = reputation.getReputation(user1);
        assertEq(rep.ctIQ, 100); // Should be capped at 100
    }

    function testOnlyKeeperCanUpdateOffChainStats() public {
        vm.expectRevert(ReputationEngine.OnlyKeeper.selector);
        reputation.updateOffChainStats(user1, 1, 1000, 80, 5);

        vm.prank(user1);
        vm.expectRevert(ReputationEngine.OnlyKeeper.selector);
        reputation.updateOffChainStats(user1, 1, 1000, 80, 5);
    }

    function testCalculateMasteryScoreDraftOnly() public {
        // User is rank 1 out of 100
        vm.prank(keeper);
        reputation.updateOffChainStats(user1, 1, 5000, 0, 0);

        uint256 score = reputation.calculateMasteryScore(user1);

        // Draft component: (100-1)/100 * 30 = 29.7 ≈ 29
        // Whisperer: 0
        // Timecaster: 0
        // Total: ~29
        assertEq(score, 29);
    }

    function testCalculateMasteryScoreWhispererOnly() public {
        // CT IQ = 100
        vm.prank(keeper);
        reputation.updateOffChainStats(user1, 0, 0, 100, 0);

        uint256 score = reputation.calculateMasteryScore(user1);

        // Draft: 0
        // Whisperer: 100 * 30 / 100 = 30
        // Timecaster: 0
        // Total: 30
        assertEq(score, 30);
    }

    function testCalculateMasteryScoreArenaOnly() public {
        // 10 wins, 0 losses
        for (uint256 i = 0; i < 10; i++) {
            vm.prank(arena);
            reputation.updateDuelStats(user1, user2, 0.1 ether);
        }

        uint256 score = reputation.calculateMasteryScore(user1);

        // Draft: 0
        // Whisperer: 0
        // Arena: 100% win rate * 20 / 100 = 20
        // Gauntlet: 0
        // Total: 20
        assertEq(score, 20);
    }

    function testCalculateMasteryScoreGauntletOnly() public {
        // Perfect 5/5 for 1 day
        vm.prank(gauntlet);
        reputation.updateGauntletStats(user1, 5);

        uint256 score = reputation.calculateMasteryScore(user1);

        // Draft: 0
        // Whisperer: 0
        // Arena: 0
        // Gauntlet: 100% accuracy * 20 / 100 = 20
        // Total: 20
        assertEq(score, 20);
    }

    function testCalculateMasteryScoreCombined() public {
        // Draft: rank 5 out of 100
        // Whisperer: CT IQ 90
        // Arena: 8 wins, 2 losses (80% win rate)
        // Gauntlet: 20 correct out of 25 (80% accuracy)

        vm.prank(keeper);
        reputation.updateOffChainStats(user1, 5, 5000, 90, 10);

        // Arena
        for (uint256 i = 0; i < 8; i++) {
            vm.prank(arena);
            reputation.updateDuelStats(user1, user2, 0.1 ether);
        }
        for (uint256 i = 0; i < 2; i++) {
            vm.prank(arena);
            reputation.updateDuelStats(user2, user1, 0.1 ether);
        }

        // Gauntlet (5 days, 4/5 correct each)
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(gauntlet);
            reputation.updateGauntletStats(user1, 4);
        }

        uint256 score = reputation.calculateMasteryScore(user1);

        // Draft: (100-5)/100 * 30 = 28.5 ≈ 28
        // Whisperer: 90 * 30 / 100 = 27
        // Arena: 80% * 20 / 100 = 16
        // Gauntlet: 80% * 20 / 100 = 16
        // Total: 28 + 27 + 16 + 16 = 87
        assertEq(score, 87);
    }

    function testScoreCappedAt100() public {
        // Give user perfect scores in everything
        vm.prank(keeper);
        reputation.updateOffChainStats(user1, 1, 10000, 100, 50);

        // Perfect arena record
        for (uint256 i = 0; i < 20; i++) {
            vm.prank(arena);
            reputation.updateDuelStats(user1, user2, 1 ether);
        }

        // Perfect gauntlet record
        for (uint256 i = 0; i < 20; i++) {
            vm.prank(gauntlet);
            reputation.updateGauntletStats(user1, 5);
        }

        uint256 score = reputation.calculateMasteryScore(user1);

        // Should be capped at 100
        assertEq(score, 100);
    }

    function testTransferOwnership() public {
        vm.expectEmit(true, true, false, false);
        emit ReputationEngine.OwnershipTransferred(owner, user1);

        reputation.transferOwnership(user1);

        assertEq(reputation.owner(), user1);
    }

    function testCannotTransferToZeroAddress() public {
        vm.expectRevert(ReputationEngine.InvalidAddress.selector);
        reputation.transferOwnership(address(0));
    }

    function testSetTotalPlayers() public {
        vm.prank(keeper);
        reputation.setTotalPlayers(500);

        assertEq(reputation.totalPlayers(), 500);
    }

    function testReputationEventsEmitted() public {
        vm.expectEmit(true, false, false, false);
        emit ReputationEngine.ReputationUpdated(user1, 0); // Will be calculated

        vm.prank(arena);
        reputation.updateDuelStats(user1, user2, 0.1 ether);
    }
}
