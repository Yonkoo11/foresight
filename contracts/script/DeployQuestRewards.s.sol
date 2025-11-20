// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/QuestRewards.sol";

/**
 * @title DeployQuestRewards
 * @notice Deployment script for QuestRewards contract only
 * @dev Requires existing Treasury and ReputationEngine addresses
 *
 * Usage:
 *   forge script script/DeployQuestRewards.s.sol:DeployQuestRewards \
 *     --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast
 */
contract DeployQuestRewards is Script {
    QuestRewards public questRewards;

    // Existing deployed contract addresses (from previous deployment)
    address public constant TREASURY = 0x7A395d0B4E1542335DB3478171a08Cf34E97180f;
    address public constant REPUTATION_ENGINE = 0x24C8171af3e2EbA7fCF53BDB5B958Ed2AB36fb0c;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("========================================");
        console.log("QuestRewards Deployment");
        console.log("========================================");
        console.log("Deployer:", deployer);
        console.log("Treasury:", TREASURY);
        console.log("ReputationEngine:", REPUTATION_ENGINE);
        console.log("========================================\n");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy QuestRewards
        console.log("Deploying QuestRewards...");
        questRewards = new QuestRewards(TREASURY, REPUTATION_ENGINE);
        console.log("  QuestRewards deployed at:", address(questRewards));

        vm.stopBroadcast();

        // Print deployment summary
        console.log("\n========================================");
        console.log("Deployment Complete!");
        console.log("========================================");
        console.log("QuestRewards:", address(questRewards));
        console.log("");

        console.log("Next Steps:");
        console.log("-------------------");
        console.log("1. Update backend/.env:");
        console.log("   QUEST_REWARDS_ADDRESS=", address(questRewards));
        console.log("");
        console.log("2. Update frontend/src/contracts/addresses.ts");
        console.log("");
        console.log("3. Fund the QuestRewards contract with ETH for rewards");
        console.log("========================================");
    }
}
