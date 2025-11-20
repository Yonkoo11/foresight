// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "openzeppelin-contracts/contracts/utils/Base64.sol";
import "./ReputationEngine.sol";

/**
 * @title ForesightNFT
 * @notice Soulbound NFT displaying unified CT Mastery Score across all apps
 * @dev Dynamically generates SVG from ReputationEngine data
 */
contract ForesightNFT is ERC721 {
    using Strings for uint256;

    address public reputationEngine;
    address public owner;
    uint256 private _nextTokenId;

    mapping(address => uint256) public ownerToTokenId;
    mapping(uint256 => address) public tokenIdToOwner;

    error TokenSoulbound();
    error OnlyOwner();
    error AlreadyMinted();
    error InvalidAddress();

    event MetadataUpdate(uint256 tokenId);

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor(address _reputationEngine) ERC721("CT Mastery NFT", "CTMASTERY") {
        if (_reputationEngine == address(0)) revert InvalidAddress();
        reputationEngine = _reputationEngine;
        owner = msg.sender;
    }

    /**
     * @notice Mint a new CT Mastery NFT to a user
     * @param to Address to mint to
     */
    function mint(address to) external onlyOwner returns (uint256) {
        if (balanceOf(to) > 0) revert AlreadyMinted();

        uint256 tokenId = _nextTokenId++;
        ownerToTokenId[to] = tokenId;
        tokenIdToOwner[tokenId] = to;

        _safeMint(to, tokenId);
        return tokenId;
    }

    /**
     * @notice Trigger metadata update (called when reputation changes)
     * @param user Address of user
     */
    function refreshMetadata(address user) external {
        uint256 tokenId = ownerToTokenId[user];
        emit MetadataUpdate(tokenId);
    }

    /**
     * @notice Generate dynamic SVG based on user's CT Mastery stats
     */
    function generateSVG(address user) internal view returns (string memory) {
        ReputationEngine repEngine = ReputationEngine(reputationEngine);
        ReputationEngine.UserReputation memory rep = repEngine.getReputation(user);

        uint256 masteryScore = rep.ctMasteryScore;
        string memory level = _getLevel(masteryScore);
        string memory color = _getColorForScore(masteryScore);

        // Calculate total arena games and win rate
        uint256 totalArenaGames = rep.arenaWins + rep.arenaLosses;
        uint256 arenaWinRate = totalArenaGames > 0
            ? (rep.arenaWins * 100) / totalArenaGames
            : 0;

        // Calculate gauntlet accuracy
        uint256 gauntletAccuracy = rep.totalPredictions > 0
            ? (rep.totalCorrect * 100) / rep.totalPredictions
            : 0;

        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" style="background:#0a0a0a">',
                '<defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" style="stop-color:',
                color,
                ';stop-opacity:1"/><stop offset="100%" style="stop-color:#000;stop-opacity:1"/>',
                '</linearGradient></defs>',
                '<rect width="400" height="500" fill="url(#grad)"/>',

                // Header
                '<text x="200" y="50" font-family="monospace" font-size="20" fill="#fff" text-anchor="middle" font-weight="bold">CT MASTERY</text>',

                // Main score
                '<text x="200" y="120" font-family="monospace" font-size="64" fill="',
                color,
                '" text-anchor="middle" font-weight="bold">',
                masteryScore.toString(),
                '</text>',
                '<text x="200" y="150" font-family="monospace" font-size="18" fill="#999" text-anchor="middle">',
                level,
                '</text>',

                '<line x1="50" y1="180" x2="350" y2="180" stroke="#333" stroke-width="2"/>',

                // CT Draft section
                '<text x="200" y="210" font-family="monospace" font-size="16" fill="#aaa" text-anchor="middle">CT DRAFT</text>',
                '<text x="70" y="240" font-family="monospace" font-size="13" fill="#888">Rank</text>',
                '<text x="330" y="240" font-family="monospace" font-size="16" fill="#fff" text-anchor="end" font-weight="bold">',
                rep.draftRank > 0 ? string(abi.encodePacked('#', rep.draftRank.toString())) : '--',
                '</text>',

                '<line x1="50" y1="260" x2="350" y2="260" stroke="#222" stroke-width="1"/>',

                // CT Whisperer section
                '<text x="200" y="285" font-family="monospace" font-size="16" fill="#aaa" text-anchor="middle">CT WHISPERER</text>',
                '<text x="70" y="315" font-family="monospace" font-size="13" fill="#888">IQ</text>',
                '<text x="330" y="315" font-family="monospace" font-size="16" fill="#fff" text-anchor="end" font-weight="bold">',
                rep.ctIQ.toString(),
                '</text>',

                '<line x1="50" y1="335" x2="350" y2="335" stroke="#222" stroke-width="1"/>',

                // Timecaster Arena section
                '<text x="200" y="360" font-family="monospace" font-size="16" fill="#aaa" text-anchor="middle">ARENA</text>',
                '<text x="70" y="390" font-family="monospace" font-size="13" fill="#888">Record</text>',
                '<text x="330" y="390" font-family="monospace" font-size="16" fill="#fff" text-anchor="end" font-weight="bold">',
                rep.arenaWins.toString(), 'W-', rep.arenaLosses.toString(), 'L',
                '</text>',
                '<text x="70" y="415" font-family="monospace" font-size="13" fill="#888">Win Rate</text>',
                '<text x="330" y="415" font-family="monospace" font-size="16" fill="',
                arenaWinRate >= 50 ? color : "#666",
                '" text-anchor="end" font-weight="bold">',
                arenaWinRate.toString(), '%',
                '</text>',

                '<line x1="50" y1="435" x2="350" y2="435" stroke="#222" stroke-width="1"/>',

                // Timecaster Gauntlet section
                '<text x="70" y="460" font-family="monospace" font-size="13" fill="#888">Gauntlet</text>',
                '<text x="330" y="460" font-family="monospace" font-size="16" fill="',
                gauntletAccuracy >= 50 ? color : "#666",
                '" text-anchor="end" font-weight="bold">',
                gauntletAccuracy.toString(), '%',
                '</text>',

                '<line x1="50" y1="475" x2="350" y2="475" stroke="#333" stroke-width="2"/>',

                // Footer
                '<text x="200" y="495" font-family="monospace" font-size="11" fill="#555" text-anchor="middle">CT LEAGUE</text>',
                "</svg>"
            )
        );
    }

    /**
     * @notice Get level name based on CT Mastery Score
     */
    function _getLevel(uint256 score) internal pure returns (string memory) {
        if (score >= 90) return "ORACLE";
        if (score >= 75) return "PROPHET";
        if (score >= 60) return "SEER";
        if (score >= 40) return "APPRENTICE";
        return "NOVICE";
    }

    /**
     * @notice Get color based on score
     */
    function _getColorForScore(uint256 score) internal pure returns (string memory) {
        if (score >= 90) return "#FFD700"; // Gold
        if (score >= 75) return "#9b59b6"; // Purple
        if (score >= 60) return "#3498db"; // Blue
        if (score >= 40) return "#2ecc71"; // Green
        return "#95a5a6"; // Gray
    }

    /**
     * @notice Generate dynamic tokenURI with live stats
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        address user = tokenIdToOwner[tokenId];
        require(user != address(0), "Token does not exist");

        string memory svg = generateSVG(user);

        ReputationEngine repEngine = ReputationEngine(reputationEngine);
        ReputationEngine.UserReputation memory rep = repEngine.getReputation(user);

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"CT Mastery #',
                        tokenId.toString(),
                        '","description":"Unified onchain reputation across CT Draft, CT Whisperer, and Timecaster. Your CT Mastery Score updates in real-time based on performance across all apps.","image":"data:image/svg+xml;base64,',
                        Base64.encode(bytes(svg)),
                        '","attributes":[',
                        '{"trait_type":"CT Mastery Score","value":', rep.ctMasteryScore.toString(), '},',
                        '{"trait_type":"Level","value":"', _getLevel(rep.ctMasteryScore), '"},',
                        '{"trait_type":"Draft Rank","value":', rep.draftRank.toString(), '},',
                        '{"trait_type":"CT IQ","value":', rep.ctIQ.toString(), '},',
                        '{"trait_type":"Arena Wins","value":', rep.arenaWins.toString(), '},',
                        '{"trait_type":"Gauntlet Days","value":', rep.gauntletDays.toString(), '}',
                        ']}'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    /**
     * @notice Override transfer functions to make token soulbound
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert TokenSoulbound();
        }
        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Disable approvals (soulbound)
     */
    function approve(address, uint256) public pure override {
        revert TokenSoulbound();
    }

    /**
     * @notice Disable approvals (soulbound)
     */
    function setApprovalForAll(address, bool) public pure override {
        revert TokenSoulbound();
    }

    /**
     * @notice Update reputation engine address (emergency only)
     */
    function setReputationEngine(address _reputationEngine) external onlyOwner {
        if (_reputationEngine == address(0)) revert InvalidAddress();
        reputationEngine = _reputationEngine;
    }

    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        owner = newOwner;
    }
}
