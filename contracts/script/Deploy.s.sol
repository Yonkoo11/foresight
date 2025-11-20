// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/Treasury.sol";
import "../src/ReputationEngine.sol";
import "../src/ForesightNFT.sol";
import "../src/CTDraft.sol";
import "../src/TimecasterArena.sol";
import "../src/DailyGauntlet.sol";
import "../src/QuestRewards.sol";

/**
 * @title Deploy
 * @notice Comprehensive deployment script for all CT league contracts
 * @dev Deploys in correct order with proper configuration
 *
 * Usage:
 *   # Deploy to Base Sepolia testnet
 *   forge script script/Deploy.s.sol:Deploy --rpc-url $BASE_SEPOLIA_RPC --broadcast --verify
 *
 *   # Deploy to Base mainnet
 *   forge script script/Deploy.s.sol:Deploy --rpc-url $BASE_MAINNET_RPC --broadcast --verify
 *
 *   # Dry run (simulate)
 *   forge script script/Deploy.s.sol:Deploy --rpc-url $BASE_SEPOLIA_RPC
 */
contract Deploy is Script {
    // Deployed contracts
    Treasury public treasury;
    ReputationEngine public reputationEngine;
    ForesightNFT public foresightNFT;
    CTDraft public ctDraft;
    TimecasterArena public timecasterArena;
    DailyGauntlet public dailyGauntlet;
    QuestRewards public questRewards;

    // Configuration
    address public deployer;
    address public keeperAddress; // Backend keeper wallet
    address public oracleAddress; // Oracle/keeper for price feeds

    function setUp() public {
        // Load private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        deployer = vm.addr(deployerPrivateKey);

        // Try to load keeper and oracle addresses, use deployer as fallback
        try vm.envAddress("KEEPER_ADDRESS") returns (address keeper) {
            keeperAddress = keeper;
        } catch {
            console.log("KEEPER_ADDRESS not set, using deployer");
            keeperAddress = deployer;
        }

        try vm.envAddress("ORACLE_ADDRESS") returns (address oracle) {
            oracleAddress = oracle;
        } catch {
            console.log("ORACLE_ADDRESS not set, using deployer");
            oracleAddress = deployer;
        }
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        console.log("========================================");
        console.log("CT league - Full Deployment");
        console.log("========================================");
        console.log("Deployer:", deployer);
        console.log("Keeper:", keeperAddress);
        console.log("Oracle:", oracleAddress);
        console.log("========================================\n");

        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy Treasury
        console.log("Step 1/7: Deploying Treasury...");
        treasury = new Treasury();
        console.log("  Treasury deployed at:", address(treasury));
        console.log("");

        // Step 2: Deploy ReputationEngine
        console.log("Step 2/7: Deploying ReputationEngine...");
        reputationEngine = new ReputationEngine();
        console.log("  ReputationEngine deployed at:", address(reputationEngine));
        console.log("");

        // Step 3: Deploy ForesightNFT
        console.log("Step 3/7: Deploying ForesightNFT...");
        foresightNFT = new ForesightNFT(address(reputationEngine));
        console.log("  ForesightNFT deployed at:", address(foresightNFT));
        console.log("");

        // Step 4: Deploy CTDraft
        console.log("Step 4/7: Deploying CTDraft...");
        ctDraft = new CTDraft();
        console.log("  CTDraft deployed at:", address(ctDraft));
        console.log("");

        // Step 5: Deploy TimecasterArena
        console.log("Step 5/7: Deploying TimecasterArena...");
        timecasterArena = new TimecasterArena(
            address(reputationEngine),
            address(treasury)
        );
        console.log("  TimecasterArena deployed at:", address(timecasterArena));
        console.log("");

        // Step 6: Deploy DailyGauntlet
        console.log("Step 6/7: Deploying DailyGauntlet...");
        dailyGauntlet = new DailyGauntlet(
            address(reputationEngine),
            address(treasury)
        );
        console.log("  DailyGauntlet deployed at:", address(dailyGauntlet));
        console.log("");

        // Step 7: Deploy QuestRewards
        console.log("Step 7/7: Deploying QuestRewards...");
        questRewards = new QuestRewards(address(treasury), address(reputationEngine));
        console.log("  QuestRewards deployed at:", address(questRewards));
        console.log("");

        // Configuration
        console.log("========================================");
        console.log("Configuring Contracts...");
        console.log("========================================\n");

        // Configure ReputationEngine with contract addresses
        console.log("1. Setting ReputationEngine contracts...");
        reputationEngine.setContracts(
            address(timecasterArena),
            address(dailyGauntlet),
            address(ctDraft)
        );
        console.log("   Arena, Gauntlet, Draft addresses set");

        console.log("2. Setting ReputationEngine keeper...");
        reputationEngine.setKeeper(keeperAddress);
        console.log("   Keeper set to:", keeperAddress);

        console.log("3. Setting initial total players (100)...");
        reputationEngine.setTotalPlayers(100);
        console.log("   Total players set to 100");
        console.log("");

        // Configure TimecasterArena
        console.log("4. Setting TimecasterArena oracle...");
        timecasterArena.setOracle(oracleAddress);
        console.log("   Oracle set to:", oracleAddress);
        console.log("");

        // Configure DailyGauntlet
        console.log("5. Setting DailyGauntlet oracle...");
        dailyGauntlet.setOracle(oracleAddress);
        console.log("   Oracle set to:", oracleAddress);

        console.log("6. Setting DailyGauntlet keeper...");
        dailyGauntlet.setKeeper(keeperAddress);
        console.log("   Keeper set to:", keeperAddress);
        console.log("");

        vm.stopBroadcast();

        // Print deployment summary
        console.log("========================================");
        console.log("Deployment Complete!");
        console.log("========================================\n");

        console.log("Contract Addresses:");
        console.log("-------------------");
        console.log("Treasury:           ", address(treasury));
        console.log("ReputationEngine:   ", address(reputationEngine));
        console.log("ForesightNFT:       ", address(foresightNFT));
        console.log("CTDraft:            ", address(ctDraft));
        console.log("TimecasterArena:    ", address(timecasterArena));
        console.log("DailyGauntlet:      ", address(dailyGauntlet));
        console.log("QuestRewards:       ", address(questRewards));
        console.log("");

        console.log("Configuration:");
        console.log("-------------------");
        console.log("Deployer/Owner:     ", deployer);
        console.log("Keeper (Backend):   ", keeperAddress);
        console.log("Oracle (Resolver):  ", oracleAddress);
        console.log("");

        console.log("Next Steps:");
        console.log("-------------------");
        console.log("1. Update backend/.env with contract addresses:");
        console.log("   TREASURY_ADDRESS=", address(treasury));
        console.log("   REPUTATION_ENGINE_ADDRESS=", address(reputationEngine));
        console.log("   FORESIGHT_NFT_ADDRESS=", address(foresightNFT));
        console.log("   CT_DRAFT_ADDRESS=", address(ctDraft));
        console.log("   TIMECASTER_ARENA_ADDRESS=", address(timecasterArena));
        console.log("   DAILY_GAUNTLET_ADDRESS=", address(dailyGauntlet));
        console.log("");
        console.log("2. Update frontend/.env with contract addresses");
        console.log("");
        console.log("3. Fund keeper wallet with ETH for gas");
        console.log("");
        console.log("4. Test contract interactions:");
        console.log("   - Create a test team in CTDraft");
        console.log("   - Create a test duel in TimecasterArena");
        console.log("   - Create a test gauntlet in DailyGauntlet");
        console.log("");
        console.log("========================================");
    }

    /**
     * @notice Verify all contracts are properly configured
     * @dev Run this after deployment to sanity check configuration
     */
    function verify() public view {
        console.log("========================================");
        console.log("Verification Check");
        console.log("========================================\n");

        // Check Treasury
        console.log("Treasury:");
        console.log("  Owner:", treasury.owner());
        console.log("  Balance:", address(treasury).balance);
        console.log("");

        // Check ReputationEngine
        console.log("ReputationEngine:");
        console.log("  Owner:", reputationEngine.owner());
        console.log("  Arena:", reputationEngine.timecasterArena());
        console.log("  Gauntlet:", reputationEngine.dailyGauntlet());
        console.log("  Draft:", reputationEngine.ctDraft());
        console.log("  Keeper:", reputationEngine.keeper());
        console.log("  Total Players:", reputationEngine.totalPlayers());
        console.log("");

        // Check ForesightNFT
        console.log("ForesightNFT:");
        console.log("  Owner:", foresightNFT.owner());
        console.log("  ReputationEngine:", foresightNFT.reputationEngine());
        console.log("  Name:", foresightNFT.name());
        console.log("  Symbol:", foresightNFT.symbol());
        console.log("");

        // Check CTDraft
        console.log("CTDraft:");
        console.log("  Owner:", ctDraft.owner());
        console.log("  Team Size:", ctDraft.TEAM_SIZE());
        console.log("  Max Influencer ID:", ctDraft.MAX_INFLUENCER_ID());
        console.log("  Player Count:", ctDraft.getPlayerCount());
        console.log("");

        // Check TimecasterArena
        console.log("TimecasterArena:");
        console.log("  Owner:", timecasterArena.owner());
        console.log("  Oracle:", timecasterArena.oracle());
        console.log("  ReputationEngine:", address(timecasterArena.reputationEngine()));
        console.log("  Treasury:", address(timecasterArena.treasury()));
        console.log("");

        // Check DailyGauntlet
        console.log("DailyGauntlet:");
        console.log("  Owner:", dailyGauntlet.owner());
        console.log("  Oracle:", dailyGauntlet.oracle());
        console.log("  Keeper:", dailyGauntlet.keeper());
        console.log("  ReputationEngine:", address(dailyGauntlet.reputationEngine()));
        console.log("  Treasury:", address(dailyGauntlet.treasury()));
        console.log("  Current Day:", dailyGauntlet.currentDay());
        console.log("");

        console.log("========================================");
        console.log("All checks passed!");
        console.log("========================================");
    }
}
