// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CTDraft.sol";

contract CTDraftTest is Test {
    CTDraft public draft;

    address public owner = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    address public user3 = address(0x3);

    function setUp() public {
        draft = new CTDraft();
    }

    function testDeployment() public {
        assertEq(draft.owner(), owner);
        assertEq(draft.TEAM_SIZE(), 5);
        assertEq(draft.MAX_INFLUENCER_ID(), 100);
        assertEq(draft.getPlayerCount(), 0);
    }

    function testSetTeam() public {
        uint256[5] memory influencerIds = [uint256(1), 2, 3, 4, 5];

        vm.prank(user1);
        draft.setTeam(influencerIds);

        CTDraft.Team memory team = draft.getTeam(user1);

        assertEq(team.user, user1);
        assertEq(team.influencerIds[0], 1);
        assertEq(team.influencerIds[1], 2);
        assertEq(team.influencerIds[2], 3);
        assertEq(team.influencerIds[3], 4);
        assertEq(team.influencerIds[4], 5);
        assertTrue(team.exists);
        assertEq(draft.getPlayerCount(), 1);
    }

    function testSetTeamEmitsCreatedEvent() public {
        uint256[5] memory influencerIds = [uint256(10), 20, 30, 40, 50];

        vm.prank(user1);
        vm.expectEmit(true, false, false, true);
        emit CTDraft.TeamCreated(user1, influencerIds);

        draft.setTeam(influencerIds);
    }

    function testUpdateTeam() public {
        uint256[5] memory influencerIds1 = [uint256(1), 2, 3, 4, 5];
        uint256[5] memory influencerIds2 = [uint256(6), 7, 8, 9, 10];

        vm.startPrank(user1);
        draft.setTeam(influencerIds1);
        draft.setTeam(influencerIds2);
        vm.stopPrank();

        CTDraft.Team memory team = draft.getTeam(user1);

        assertEq(team.influencerIds[0], 6);
        assertEq(team.influencerIds[1], 7);
        assertEq(team.influencerIds[2], 8);
        assertEq(team.influencerIds[3], 9);
        assertEq(team.influencerIds[4], 10);
        assertEq(draft.getPlayerCount(), 1); // Should still be 1
    }

    function testUpdateTeamEmitsUpdatedEvent() public {
        uint256[5] memory influencerIds1 = [uint256(1), 2, 3, 4, 5];
        uint256[5] memory influencerIds2 = [uint256(6), 7, 8, 9, 10];

        vm.startPrank(user1);
        draft.setTeam(influencerIds1);

        vm.expectEmit(true, false, false, true);
        emit CTDraft.TeamUpdated(user1, influencerIds2);

        draft.setTeam(influencerIds2);
        vm.stopPrank();
    }

    function testCannotSetTeamWithInvalidIdZero() public {
        uint256[5] memory influencerIds = [uint256(0), 2, 3, 4, 5];

        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(CTDraft.InvalidInfluencerId.selector, 0));
        draft.setTeam(influencerIds);
    }

    function testCannotSetTeamWithInvalidIdAboveMax() public {
        uint256[5] memory influencerIds = [uint256(1), 2, 3, 4, 101];

        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(CTDraft.InvalidInfluencerId.selector, 101));
        draft.setTeam(influencerIds);
    }

    function testCannotSetTeamWithDuplicates() public {
        uint256[5] memory influencerIds = [uint256(1), 2, 3, 2, 5]; // 2 appears twice

        vm.prank(user1);
        vm.expectRevert(CTDraft.DuplicateInfluencer.selector);
        draft.setTeam(influencerIds);
    }

    function testGetTeamInfluencers() public {
        uint256[5] memory influencerIds = [uint256(10), 20, 30, 40, 50];

        vm.prank(user1);
        draft.setTeam(influencerIds);

        uint256[5] memory retrieved = draft.getTeamInfluencers(user1);

        assertEq(retrieved[0], 10);
        assertEq(retrieved[1], 20);
        assertEq(retrieved[2], 30);
        assertEq(retrieved[3], 40);
        assertEq(retrieved[4], 50);
    }

    function testHasTeam() public {
        assertFalse(draft.hasTeam(user1));

        uint256[5] memory influencerIds = [uint256(1), 2, 3, 4, 5];

        vm.prank(user1);
        draft.setTeam(influencerIds);

        assertTrue(draft.hasTeam(user1));
    }

    function testGetPlayerCount() public {
        assertEq(draft.getPlayerCount(), 0);

        uint256[5] memory influencerIds = [uint256(1), 2, 3, 4, 5];

        vm.prank(user1);
        draft.setTeam(influencerIds);

        assertEq(draft.getPlayerCount(), 1);

        vm.prank(user2);
        draft.setTeam(influencerIds);

        assertEq(draft.getPlayerCount(), 2);

        // Updating existing team shouldn't increase count
        vm.prank(user1);
        draft.setTeam([uint256(6), 7, 8, 9, 10]);

        assertEq(draft.getPlayerCount(), 2);
    }

    function testGetAllPlayers() public {
        uint256[5] memory influencerIds = [uint256(1), 2, 3, 4, 5];

        vm.prank(user1);
        draft.setTeam(influencerIds);

        vm.prank(user2);
        draft.setTeam(influencerIds);

        vm.prank(user3);
        draft.setTeam(influencerIds);

        address[] memory players = draft.getAllPlayers(0, 10);

        assertEq(players.length, 3);
        assertEq(players[0], user1);
        assertEq(players[1], user2);
        assertEq(players[2], user3);
    }

    function testGetAllPlayersPagination() public {
        uint256[5] memory influencerIds = [uint256(1), 2, 3, 4, 5];

        vm.prank(user1);
        draft.setTeam(influencerIds);

        vm.prank(user2);
        draft.setTeam(influencerIds);

        vm.prank(user3);
        draft.setTeam(influencerIds);

        // Get first 2
        address[] memory players1 = draft.getAllPlayers(0, 2);
        assertEq(players1.length, 2);
        assertEq(players1[0], user1);
        assertEq(players1[1], user2);

        // Get last 1
        address[] memory players2 = draft.getAllPlayers(2, 10);
        assertEq(players2.length, 1);
        assertEq(players2[0], user3);
    }

    function testGetAllPlayersWithOffsetBeyondTotal() public {
        address[] memory players = draft.getAllPlayers(10, 10);
        assertEq(players.length, 0);
    }

    function testGetTeamsBatch() public {
        uint256[5] memory influencerIds1 = [uint256(1), 2, 3, 4, 5];
        uint256[5] memory influencerIds2 = [uint256(6), 7, 8, 9, 10];

        vm.prank(user1);
        draft.setTeam(influencerIds1);

        vm.prank(user2);
        draft.setTeam(influencerIds2);

        address[] memory users = new address[](2);
        users[0] = user1;
        users[1] = user2;

        CTDraft.Team[] memory teams = draft.getTeamsBatch(users);

        assertEq(teams.length, 2);
        assertEq(teams[0].user, user1);
        assertEq(teams[0].influencerIds[0], 1);
        assertEq(teams[1].user, user2);
        assertEq(teams[1].influencerIds[0], 6);
    }

    function testGetTeamsBatchWithNonExistentUser() public {
        uint256[5] memory influencerIds = [uint256(1), 2, 3, 4, 5];

        vm.prank(user1);
        draft.setTeam(influencerIds);

        address[] memory users = new address[](2);
        users[0] = user1;
        users[1] = user2; // Doesn't have a team

        CTDraft.Team[] memory teams = draft.getTeamsBatch(users);

        assertEq(teams.length, 2);
        assertEq(teams[0].user, user1);
        assertTrue(teams[0].exists);
        assertEq(teams[1].user, address(0));
        assertFalse(teams[1].exists);
    }

    function testTransferOwnership() public {
        draft.transferOwnership(user1);
        assertEq(draft.owner(), user1);
    }

    function testCannotTransferOwnershipToZero() public {
        vm.expectRevert("Invalid address");
        draft.transferOwnership(address(0));
    }

    function testOnlyOwnerCanTransferOwnership() public {
        vm.prank(user1);
        vm.expectRevert(CTDraft.OnlyOwner.selector);
        draft.transferOwnership(user2);
    }

    function testSetMaxInfluencerId() public {
        // Function exists but doesn't do anything (MAX_INFLUENCER_ID is constant)
        // Just testing it doesn't revert
        draft.setMaxInfluencerId(200);
    }

    function testOnlyOwnerCanSetMaxInfluencerId() public {
        vm.prank(user1);
        vm.expectRevert(CTDraft.OnlyOwner.selector);
        draft.setMaxInfluencerId(200);
    }
}
