// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/ForesightNFT.sol";
import "../src/ReputationEngine.sol";

contract ForesightNFTTest is Test {
    ForesightNFT public nft;
    ReputationEngine public reputation;

    address public owner = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        reputation = new ReputationEngine();
        nft = new ForesightNFT(address(reputation));
    }

    function testDeployment() public {
        assertEq(nft.owner(), owner);
        assertEq(nft.reputationEngine(), address(reputation));
        assertEq(nft.name(), "CT Mastery NFT");
        assertEq(nft.symbol(), "CTMASTERY");
    }

    function testMint() public {
        uint256 tokenId = nft.mint(user1);

        assertEq(tokenId, 0);
        assertEq(nft.balanceOf(user1), 1);
        assertEq(nft.ownerOf(tokenId), user1);
        assertEq(nft.ownerToTokenId(user1), tokenId);
        assertEq(nft.tokenIdToOwner(tokenId), user1);
    }

    function testCannotMintTwice() public {
        nft.mint(user1);

        vm.expectRevert(ForesightNFT.AlreadyMinted.selector);
        nft.mint(user1);
    }

    function testOnlyOwnerCanMint() public {
        vm.prank(user1);
        vm.expectRevert(ForesightNFT.OnlyOwner.selector);
        nft.mint(user2);
    }

    function testRefreshMetadata() public {
        uint256 tokenId = nft.mint(user1);

        vm.expectEmit(false, false, false, true);
        emit ForesightNFT.MetadataUpdate(tokenId);

        nft.refreshMetadata(user1);
    }

    function testTokenURI() public {
        nft.mint(user1);

        string memory uri = nft.tokenURI(0);

        // Check that URI is data URI
        assertTrue(bytes(uri).length > 0);
        // Should start with "data:application/json;base64,"
        assertEq(
            substring(uri, 0, 29),
            "data:application/json;base64,"
        );
    }

    function testTokenURIWithStats() public {
        // Set up some reputation
        address arena = address(0x10);
        address gauntlet = address(0x11);
        address draft = address(0x12);
        address keeper = address(0x13);

        reputation.setContracts(arena, gauntlet, draft);
        reputation.setKeeper(keeper);
        reputation.setTotalPlayers(100);

        // Update user1's reputation
        vm.prank(keeper);
        reputation.updateOffChainStats(user1, 5, 5000, 85, 10);

        vm.prank(arena);
        reputation.updateDuelStats(user1, user2, 0.1 ether);

        vm.prank(gauntlet);
        reputation.updateGauntletStats(user1, 4);

        // Mint NFT
        nft.mint(user1);

        // Get URI
        string memory uri = nft.tokenURI(0);

        // Verify it's a valid data URI
        assertTrue(bytes(uri).length > 100); // Should be substantial
    }

    function testTokenSoulbound() public {
        uint256 tokenId = nft.mint(user1);

        vm.prank(user1);
        vm.expectRevert(ForesightNFT.TokenSoulbound.selector);
        nft.transferFrom(user1, user2, tokenId);
    }

    function testCannotApprove() public {
        uint256 tokenId = nft.mint(user1);

        vm.prank(user1);
        vm.expectRevert(ForesightNFT.TokenSoulbound.selector);
        nft.approve(user2, tokenId);
    }

    function testCannotSetApprovalForAll() public {
        nft.mint(user1);

        vm.prank(user1);
        vm.expectRevert(ForesightNFT.TokenSoulbound.selector);
        nft.setApprovalForAll(user2, true);
    }

    function testSetReputationEngine() public {
        ReputationEngine newReputation = new ReputationEngine();

        nft.setReputationEngine(address(newReputation));

        assertEq(nft.reputationEngine(), address(newReputation));
    }

    function testCannotSetReputationEngineToZero() public {
        vm.expectRevert(ForesightNFT.InvalidAddress.selector);
        nft.setReputationEngine(address(0));
    }

    function testOnlyOwnerCanSetReputationEngine() public {
        ReputationEngine newReputation = new ReputationEngine();

        vm.prank(user1);
        vm.expectRevert(ForesightNFT.OnlyOwner.selector);
        nft.setReputationEngine(address(newReputation));
    }

    function testTransferOwnership() public {
        nft.transferOwnership(user1);

        assertEq(nft.owner(), user1);
    }

    function testCannotTransferOwnershipToZero() public {
        vm.expectRevert(ForesightNFT.InvalidAddress.selector);
        nft.transferOwnership(address(0));
    }

    // Helper function to get substring
    function substring(
        string memory str,
        uint256 startIndex,
        uint256 endIndex
    ) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }
}
