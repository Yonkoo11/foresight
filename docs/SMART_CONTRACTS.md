# Smart Contracts Architecture

## Overview

Complete smart contract system for CT league ecosystem. All contracts deployed on Base (Sepolia testnet → Mainnet).

**Total Contracts: 6**
1. TimecasterArena.sol
2. DailyGauntlet.sol
3. CTDraft.sol
4. ReputationEngine.sol
5. ForesightNFT.sol
6. Treasury.sol

---

## Contract 1: TimecasterArena.sol

### Purpose
Handles 1v1 prediction duels with escrow and resolution.

### State Variables

```solidity
struct Duel {
    uint256 id;
    address challenger;
    address opponent; // address(0) if open challenge
    string statement; // "SOL will outperform ETH this week"
    uint256 stake;
    uint256 createdAt;
    uint256 acceptDeadline; // Must accept within 48h
    uint256 expiresAt; // When prediction resolves
    DuelType duelType;
    bool challengerSideYes; // Challenger's position
    DuelStatus status;
    bool outcome; // Final result
    bytes32 oracleId; // For auto-resolution
    uint256 voterCount; // For manual resolution
    uint256 yesVotes;
    uint256 noVotes;
}

enum DuelType {
    PRICE,      // Auto-resolved via Chainlink
    PROTOCOL,   // Auto-resolved via on-chain data
    NARRATIVE   // Manual resolution via community vote
}

enum DuelStatus {
    OPEN,       // Waiting for opponent
    ACTIVE,     // Accepted, waiting for resolution
    RESOLVED,   // Completed
    CANCELLED,  // Expired or cancelled
    VOTING      // Community voting in progress
}

// Mappings
Duel[] public duels;
mapping(address => uint256[]) public userDuels;
mapping(uint256 => mapping(address => bool)) public hasVoted;
mapping(uint256 => mapping(address => bool)) public voterChoice; // true = YES, false = NO
mapping(uint256 => mapping(address => uint256)) public voterStakes;

// Constants
uint256 public constant CREATION_FEE = 0.005 ether;
uint256 public constant PROTOCOL_FEE_BPS = 500; // 5%
uint256 public constant ACCEPT_DEADLINE = 48 hours;
uint256 public constant MIN_VOTERS = 10;
uint256 public constant VOTER_STAKE = 0.01 ether;

// Stake tiers (for filtering/matchmaking)
uint256 public constant BRONZE_TIER = 0.01 ether;
uint256 public constant SILVER_TIER = 0.1 ether;
uint256 public constant GOLD_TIER = 1 ether;
uint256 public constant DIAMOND_TIER = 10 ether;

address public treasury;
address public reputationEngine;
address public keeper; // Authorized oracle keeper
```

### Core Functions

#### Create Duel

```solidity
/**
 * @notice Create a new prediction duel
 * @param statement The prediction text
 * @param opponent Specific opponent address (or address(0) for open)
 * @param duelType PRICE, PROTOCOL, or NARRATIVE
 * @param challengerSideYes True if challenger bets YES, false for NO
 * @param expiresAt When prediction resolves (timestamp)
 * @param oracleId Oracle identifier (for PRICE/PROTOCOL types)
 */
function createDuel(
    string calldata statement,
    address opponent,
    DuelType duelType,
    bool challengerSideYes,
    uint256 expiresAt,
    bytes32 oracleId
) external payable returns (uint256 duelId);

// Validations:
// - msg.value >= BRONZE_TIER + CREATION_FEE
// - expiresAt > block.timestamp + 1 day && < 90 days
// - statement length <= 280 chars
// - If PRICE/PROTOCOL, oracleId must be valid
// - If opponent != address(0), opponent cannot be msg.sender

// Actions:
// 1. Deduct CREATION_FEE, send to treasury
// 2. Lock msg.value - CREATION_FEE as stake
// 3. Create Duel struct
// 4. Set status = OPEN, acceptDeadline = block.timestamp + 48h
// 5. Emit DuelCreated event
```

#### Accept Duel

```solidity
/**
 * @notice Accept an open duel or targeted challenge
 * @param duelId The duel to accept
 */
function acceptDuel(uint256 duelId) external payable;

// Validations:
// - Duel status == OPEN
// - block.timestamp <= acceptDeadline
// - If duel.opponent != address(0), msg.sender must be opponent
// - msg.value == duel.stake (must match exactly)
// - msg.sender != challenger

// Actions:
// 1. Lock msg.value as stake
// 2. Set duel.opponent = msg.sender
// 3. Set status = ACTIVE
// 4. Emit DuelAccepted event
```

#### Cancel Duel (if not accepted)

```solidity
/**
 * @notice Cancel duel if no one accepts within 48h
 * @param duelId The duel to cancel
 */
function cancelDuel(uint256 duelId) external;

// Validations:
// - msg.sender == challenger
// - status == OPEN
// - block.timestamp > acceptDeadline

// Actions:
// 1. Refund challenger's stake
// 2. Set status = CANCELLED
// 3. Emit DuelCancelled event
```

#### Resolve Duel (Auto)

```solidity
/**
 * @notice Resolve PRICE or PROTOCOL duel via oracle
 * @param duelId The duel to resolve
 * @param outcome True if prediction came true
 */
function resolveDuel(uint256 duelId, bool outcome) external;

// Validations:
// - msg.sender == keeper
// - status == ACTIVE
// - duelType == PRICE || PROTOCOL
// - block.timestamp >= expiresAt
// - Oracle data matches oracleId

// Actions:
// 1. Set duel.outcome = outcome
// 2. Calculate winner:
//    if (outcome == challengerSideYes) → challenger wins
//    else → opponent wins
// 3. Calculate payouts:
//    totalPot = duel.stake * 2
//    protocolFee = totalPot * 5 / 100
//    winnerPayout = totalPot - protocolFee
// 4. Transfer winnerPayout to winner
// 5. Transfer protocolFee to treasury
// 6. Set status = RESOLVED
// 7. Call reputationEngine.updateDuelStats(winner, loser, stake)
// 8. Emit DuelResolved event
```

#### Start Voting (Manual Resolution)

```solidity
/**
 * @notice Start community voting for NARRATIVE duel
 * @param duelId The duel to start voting on
 */
function startVoting(uint256 duelId) external;

// Validations:
// - duelType == NARRATIVE
// - status == ACTIVE
// - block.timestamp >= expiresAt
// - msg.sender == challenger || opponent

// Actions:
// 1. Set status = VOTING
// 2. Set votingDeadline = block.timestamp + 7 days
// 3. Emit VotingStarted event
```

#### Vote on Duel

```solidity
/**
 * @notice Vote on NARRATIVE duel outcome
 * @param duelId The duel to vote on
 * @param vote True for YES, false for NO
 */
function voteOnDuel(uint256 duelId, bool vote) external payable;

// Validations:
// - status == VOTING
// - block.timestamp <= votingDeadline
// - !hasVoted[duelId][msg.sender]
// - msg.value == VOTER_STAKE (0.01 ETH)

// Actions:
// 1. Lock msg.value as voter stake
// 2. Record vote: voterChoice[duelId][msg.sender] = vote
// 3. hasVoted[duelId][msg.sender] = true
// 4. voterStakes[duelId][msg.sender] = msg.value
// 5. Increment duel.voterCount
// 6. if (vote) duel.yesVotes++ else duel.noVotes++
// 7. Emit VoteCast event
```

#### Finalize Voting

```solidity
/**
 * @notice Finalize NARRATIVE duel after voting period
 * @param duelId The duel to finalize
 */
function finalizeVoting(uint256 duelId) external;

// Validations:
// - status == VOTING
// - block.timestamp > votingDeadline
// - voterCount >= MIN_VOTERS (10)

// Actions:
// 1. Determine majority: outcome = (yesVotes > noVotes)
// 2. Calculate duel winner (same as resolveDuel)
// 3. Distribute voter payouts:
//    - Correct voters split losing voters' stakes proportionally
//    - Protocol takes 5% of voter pool
// 4. Distribute duel payouts (same as resolveDuel)
// 5. Set status = RESOLVED
// 6. Update reputation for winner/loser + voters
// 7. Emit DuelResolved event
```

### Events

```solidity
event DuelCreated(
    uint256 indexed duelId,
    address indexed challenger,
    address indexed opponent,
    string statement,
    uint256 stake,
    DuelType duelType,
    uint256 expiresAt
);

event DuelAccepted(uint256 indexed duelId, address indexed opponent);
event DuelCancelled(uint256 indexed duelId);
event DuelResolved(uint256 indexed duelId, bool outcome, address winner, uint256 payout);
event VotingStarted(uint256 indexed duelId, uint256 deadline);
event VoteCast(uint256 indexed duelId, address indexed voter, bool vote);
```

### View Functions

```solidity
function getDuel(uint256 duelId) external view returns (Duel memory);
function getUserDuels(address user) external view returns (uint256[] memory);
function getOpenDuels(uint256 offset, uint256 limit) external view returns (Duel[] memory);
function getActiveDuels(address user) external view returns (Duel[] memory);
function getDuelsByTier(uint256 minStake, uint256 maxStake) external view returns (uint256[] memory);
```

---

## Contract 2: DailyGauntlet.sol

### Purpose
Daily prediction tournament with 5 auto-generated questions.

### State Variables

```solidity
struct DailyGauntlet {
    uint256 day; // Unix timestamp of day start (00:00 UTC)
    Prediction[5] predictions;
    uint256 entryDeadline; // 23:00 UTC same day
    uint256 totalParticipants;
    bool resolved;
}

struct Prediction {
    string statement;
    PredictionType predType;
    bytes32 oracleId; // For resolution
    uint256 yesStakes;
    uint256 noStakes;
    uint256 yesStakers;
    uint256 noStakers;
    bool outcome; // Final result
    bool resolved;
}

enum PredictionType {
    PRICE,        // "ETH will close above $3500 today"
    DOMINANCE,    // "BTC dominance will increase"
    SENTIMENT,    // "Fear & Greed index >50"
    VOLUME,       // "DEX volume >$2B"
    INFLUENCER    // "@cobie will have >5M impressions" (CT Draft data)
}

struct UserEntry {
    address user;
    uint256 day;
    bool[5] choices; // User's YES/NO per prediction
    uint256[5] stakes; // Amount staked per prediction
    uint8 correctCount; // 0-5
    uint256 totalPayout;
    bool claimed;
}

// Mappings
mapping(uint256 => DailyGauntlet) public gauntlets; // day => gauntlet
mapping(uint256 => mapping(address => UserEntry)) public userEntries; // day => user => entry
mapping(uint256 => mapping(uint8 => mapping(bool => uint256))) public predictionStakes; // day => predIndex => side => amount
mapping(uint256 => mapping(uint8 => mapping(bool => address[]))) public predictionStakers; // day => predIndex => side => users

// Constants
uint256 public constant MIN_STAKE_PER_PRED = 0.001 ether;
uint256 public constant MAX_STAKE_PER_PRED = 10 ether;
uint256 public constant PROTOCOL_FEE_BPS = 200; // 2%
uint256 public constant ENTRY_DEADLINE_OFFSET = 23 hours; // 23:00 UTC

address public keeper; // Authorized to generate/resolve
address public treasury;
address public reputationEngine;
```

### Core Functions

#### Generate Daily Gauntlet (Keeper Only)

```solidity
/**
 * @notice Generate today's gauntlet (called by keeper at 00:00 UTC)
 * @param day Timestamp of day (00:00 UTC)
 * @param statements Array of 5 prediction texts
 * @param predTypes Array of 5 prediction types
 * @param oracleIds Array of 5 oracle identifiers
 */
function generateDaily(
    uint256 day,
    string[5] calldata statements,
    PredictionType[5] calldata predTypes,
    bytes32[5] calldata oracleIds
) external;

// Validations:
// - msg.sender == keeper
// - gauntlets[day].day == 0 (not already generated)
// - day == current day at 00:00 UTC

// Actions:
// 1. Create DailyGauntlet struct
// 2. Populate 5 predictions with statements, types, oracleIds
// 3. Set entryDeadline = day + 23 hours
// 4. Emit GauntletGenerated event
```

#### Enter Prediction

```solidity
/**
 * @notice Stake on one prediction in today's gauntlet
 * @param day Gauntlet day
 * @param predIndex Prediction index (0-4)
 * @param choice True for YES, false for NO
 */
function enterPrediction(uint256 day, uint8 predIndex, bool choice) external payable;

// Validations:
// - block.timestamp <= gauntlets[day].entryDeadline
// - predIndex < 5
// - msg.value >= MIN_STAKE_PER_PRED && <= MAX_STAKE_PER_PRED
// - User hasn't staked on this prediction yet

// Actions:
// 1. Record user's choice: userEntries[day][msg.sender].choices[predIndex] = choice
// 2. Record stake: userEntries[day][msg.sender].stakes[predIndex] = msg.value
// 3. Update prediction totals:
//    if (choice) {
//      predictions[predIndex].yesStakes += msg.value
//      predictions[predIndex].yesStakers++
//    } else {
//      predictions[predIndex].noStakes += msg.value
//      predictions[predIndex].noStakers++
//    }
// 4. Add user to stakers array
// 5. Increment totalParticipants (if first stake of day)
// 6. Emit StakePlaced event
```

#### Resolve Gauntlet (Keeper Only)

```solidity
/**
 * @notice Resolve all 5 predictions for a day
 * @param day Gauntlet day
 * @param outcomes Array of 5 boolean results
 */
function resolveGauntlet(uint256 day, bool[5] calldata outcomes) external;

// Validations:
// - msg.sender == keeper
// - block.timestamp > gauntlets[day].entryDeadline
// - !gauntlets[day].resolved
// - Oracle data validates outcomes

// Actions:
// 1. For each prediction (0-4):
//    a. Set prediction.outcome = outcomes[i]
//    b. Calculate winners/losers
//    c. Calculate payout per prediction:
//       totalPot = yesStakes + noStakes
//       protocolFee = totalPot * 2 / 100
//       winnerPot = totalPot - protocolFee
//       If outcome == YES:
//         distribute winnerPot to yesStakers proportionally
//       else:
//         distribute winnerPot to noStakers proportionally
// 2. Set gauntlet.resolved = true
// 3. Emit GauntletResolved event
```

#### Claim Winnings

```solidity
/**
 * @notice Claim winnings from a resolved gauntlet
 * @param day Gauntlet day
 */
function claimWinnings(uint256 day) external;

// Validations:
// - gauntlets[day].resolved == true
// - !userEntries[day][msg.sender].claimed

// Actions:
// 1. Calculate user's total payout across all 5 predictions
// 2. Count correct predictions
// 3. Add 5% treasury bonus if user went 5/5 and is only one
// 4. Transfer payout to user
// 5. Set userEntries[day][msg.sender].claimed = true
// 6. Set userEntries[day][msg.sender].correctCount
// 7. Call reputationEngine.updateGauntletStats(user, correctCount)
// 8. Emit WinningsClaimed event
```

### Events

```solidity
event GauntletGenerated(uint256 indexed day, string[5] statements);
event StakePlaced(uint256 indexed day, uint8 predIndex, address indexed user, bool choice, uint256 amount);
event GauntletResolved(uint256 indexed day, bool[5] outcomes);
event WinningsClaimed(uint256 indexed day, address indexed user, uint256 amount, uint8 correctCount);
```

### View Functions

```solidity
function getGauntlet(uint256 day) external view returns (DailyGauntlet memory);
function getUserEntry(uint256 day, address user) external view returns (UserEntry memory);
function getPredictionStakes(uint256 day, uint8 predIndex) external view returns (uint256 yes, uint256 no);
function calculatePotentialPayout(uint256 day, address user) external view returns (uint256);
```

---

## Contract 3: CTDraft.sol

### Purpose
Store fantasy team state on-chain (minimal, most logic off-chain).

### State Variables

```solidity
struct Team {
    address user;
    uint256[5] influencerIds; // References to off-chain influencer IDs
    uint256 lastUpdated;
    bool exists;
}

// Mappings
mapping(address => Team) public teams;
address[] public allPlayers;

// Constants
uint256 public constant TEAM_SIZE = 5;
uint256 public constant INFLUENCER_COUNT = 100; // Tracks top 100 CT accounts

address public reputationEngine;
```

### Core Functions

```solidity
/**
 * @notice Create or update user's fantasy team
 * @param influencerIds Array of 5 influencer IDs
 */
function setTeam(uint256[5] calldata influencerIds) external;

// Validations:
// - All influencerIds < INFLUENCER_COUNT
// - No duplicates in influencerIds

// Actions:
// 1. If !teams[msg.sender].exists, add to allPlayers
// 2. Update teams[msg.sender].influencerIds
// 3. Update teams[msg.sender].lastUpdated
// 4. Emit TeamUpdated event

/**
 * @notice Get user's team
 */
function getTeam(address user) external view returns (Team memory);

/**
 * @notice Get all players count
 */
function getPlayerCount() external view returns (uint256);
```

**Note:** Most CT Draft logic (scoring, rankings) happens off-chain in backend. This contract just stores team selections for verification and reputation integration.

---

## Contract 4: ReputationEngine.sol

### Purpose
Unified reputation scoring across all three apps.

### State Variables

```solidity
struct UserReputation {
    // CT Draft stats (from backend)
    uint256 draftRank;
    uint256 draftScore;

    // CT Whisperer stats (from backend)
    uint256 ctIQ; // 0-100
    uint256 whispererStreak;

    // Timecaster Arena stats
    uint256 arenaWins;
    uint256 arenaLosses;
    uint256 totalStaked;
    uint256 totalWinnings;

    // Timecaster Gauntlet stats
    uint256 gauntletDays;
    uint256 totalCorrect;
    uint256 totalPredictions;

    // Combined score
    uint256 ctMasteryScore; // 0-100
    uint256 lastUpdated;
}

mapping(address => UserReputation) public reputations;

address public timecasterArena;
address public dailyGauntlet;
address public keeper; // Backend can update Draft/Whisperer stats
```

### Core Functions

```solidity
/**
 * @notice Update duel stats after resolution
 * @param winner Winner address
 * @param loser Loser address
 * @param stake Amount staked
 */
function updateDuelStats(address winner, address loser, uint256 stake) external;

// Validations:
// - msg.sender == timecasterArena

// Actions:
// 1. reputations[winner].arenaWins++
// 2. reputations[winner].totalWinnings += winAmount
// 3. reputations[loser].arenaLosses++
// 4. Update both users' totalStaked
// 5. Recalculate ctMasteryScore for both
// 6. Emit ReputationUpdated events

/**
 * @notice Update gauntlet stats after user claims winnings
 * @param user User address
 * @param correctCount Number of correct predictions (0-5)
 */
function updateGauntletStats(address user, uint8 correctCount) external;

// Validations:
// - msg.sender == dailyGauntlet

// Actions:
// 1. reputations[user].gauntletDays++
// 2. reputations[user].totalCorrect += correctCount
// 3. reputations[user].totalPredictions += 5
// 4. Recalculate ctMasteryScore
// 5. Emit ReputationUpdated event

/**
 * @notice Update off-chain stats (Draft, Whisperer) via keeper
 * @param user User address
 * @param draftRank Current Draft rank
 * @param draftScore Current Draft score
 * @param ctIQ CT Whisperer IQ (0-100)
 * @param whispererStreak Whisperer streak
 */
function updateOffChainStats(
    address user,
    uint256 draftRank,
    uint256 draftScore,
    uint256 ctIQ,
    uint256 whispererStreak
) external;

// Validations:
// - msg.sender == keeper

// Actions:
// 1. Update all off-chain stats
// 2. Recalculate ctMasteryScore
// 3. Emit ReputationUpdated event

/**
 * @notice Calculate CT Mastery Score (0-100)
 * @param user User address
 */
function calculateMasteryScore(address user) public view returns (uint256);

// Formula:
// ctMasteryScore = (draftComponent * 0.3) + (whispererComponent * 0.3) + (timecasterComponent * 0.4)
//
// draftComponent (0-30):
//   if draftRank == 0: 0
//   else: (1 - (rank / totalPlayers)) * 30
//
// whispererComponent (0-30):
//   ctIQ * 0.3
//
// timecasterComponent (0-40):
//   arenaWinRate = arenaWins / (arenaWins + arenaLosses)
//   gauntletAccuracy = totalCorrect / totalPredictions
//   (arenaWinRate * 20) + (gauntletAccuracy * 20)
```

### Events

```solidity
event ReputationUpdated(address indexed user, uint256 newScore);
```

---

## Contract 5: ForesightNFT.sol

### Purpose
Dynamic soulbound NFT displaying user's CT Mastery Score.

### Changes from Original

**Add CT Mastery Score Display:**

```solidity
function generateSVG(address user) internal view returns (string memory) {
    // Get data from ReputationEngine instead of old Timecaster
    UserReputation memory rep = reputationEngine.getReputation(user);

    uint256 masteryScore = rep.ctMasteryScore;
    uint256 arenaRecord = rep.arenaWins; // Display W-L
    uint256 arenaLosses = rep.arenaLosses;
    uint256 gauntletAccuracy = rep.totalPredictions > 0
        ? (rep.totalCorrect * 100) / rep.totalPredictions
        : 0;
    uint256 ctIQ = rep.ctIQ;

    // Generate SVG with:
    // - CT Mastery Score (main number)
    // - Level (NOVICE → ORACLE based on score)
    // - Arena: 12W-5L
    // - Gauntlet: 73% accuracy
    // - CT IQ: 82

    // ... SVG generation code ...
}
```

**Levels based on CT Mastery Score:**
- 90-100: ORACLE
- 75-89: PROPHET
- 60-74: SEER
- 40-59: APPRENTICE
- 0-39: NOVICE

---

## Contract 6: Treasury.sol

### Purpose
Collect protocol fees and distribute monthly rewards.

### State Variables

```solidity
struct MonthlyPool {
    uint256 month; // timestamp
    uint256 totalFees;
    bool distributed;
}

mapping(uint256 => MonthlyPool) public monthlyPools;

uint256 public currentMonthFees;

address public owner;
address public timecasterArena;
address public dailyGauntlet;

// Distribution percentages (in basis points)
uint256 public constant GAUNTLET_CHAMPIONS_BPS = 4000; // 40%
uint256 public constant ARENA_CHAMPION_BPS = 3000; // 30%
uint256 public constant SPECIAL_EVENTS_BPS = 2000; // 20%
uint256 public constant PROTOCOL_BPS = 1000; // 10%
```

### Core Functions

```solidity
/**
 * @notice Receive fees from contracts
 */
receive() external payable {
    currentMonthFees += msg.value;
    emit FeesReceived(msg.sender, msg.value);
}

/**
 * @notice Distribute monthly rewards
 * @param month Month timestamp
 * @param gauntletWinners Array of top 10 gauntlet addresses
 * @param arenaChampion Top arena player address
 */
function distributeMonthly(
    uint256 month,
    address[10] calldata gauntletWinners,
    address arenaChampion
) external;

// Validations:
// - msg.sender == owner
// - !monthlyPools[month].distributed

// Actions:
// 1. Calculate distributions:
//    gauntletPool = currentMonthFees * 40%
//    arenaPool = currentMonthFees * 30%
//    eventsPool = currentMonthFees * 20%
//    protocolPool = currentMonthFees * 10%
//
// 2. Distribute gauntlet pool to top 10:
//    1st: 20%, 2nd: 15%, 3rd: 10%, 4-10: 55% split
//
// 3. Send arena pool to champion
//
// 4. Keep eventsPool for special events (manual distribution)
//
// 5. Keep protocolPool for operations
//
// 6. Set monthlyPools[month].distributed = true
// 7. Reset currentMonthFees = 0
// 8. Emit MonthlyDistributed event
```

### Events

```solidity
event FeesReceived(address indexed from, uint256 amount);
event MonthlyDistributed(uint256 indexed month, uint256 totalAmount);
event RewardSent(address indexed recipient, uint256 amount, string reason);
```

---

## Gas Optimization Strategies

1. **Use `uint256` for booleans in arrays** (saves gas on storage)
2. **Pack structs efficiently** (order by size)
3. **Use mappings instead of arrays** where possible
4. **Batch operations** (e.g., resolve all 5 gauntlet predictions at once)
5. **Minimize storage writes** (use memory variables)
6. **Use events for data** that doesn't need to be queryable on-chain
7. **Short-circuit conditionals** (most likely to fail first)
8. **Custom errors** instead of require strings

---

## Testing Strategy

### Unit Tests (Foundry)

**Per Contract:**
- Test all state-changing functions
- Test access control (onlyKeeper, onlyOwner)
- Test edge cases (zero values, max values)
- Test reverts (expected failures)
- Fuzz testing (random inputs)

**Example Test Structure:**
```solidity
contract TimecasterArenaTest is Test {
    TimecasterArena arena;
    Treasury treasury;
    ReputationEngine reputation;

    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        treasury = new Treasury();
        reputation = new ReputationEngine();
        arena = new TimecasterArena(address(treasury), address(reputation));

        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
    }

    function testCreateDuel() public { /* ... */ }
    function testAcceptDuel() public { /* ... */ }
    function testResolveDuel() public { /* ... */ }
    function testCannotAcceptOwnDuel() public { /* ... */ }
    // ... 20+ tests per contract
}
```

### Integration Tests

- Test full duel lifecycle (create → accept → resolve → payout)
- Test full gauntlet lifecycle (generate → enter → resolve → claim)
- Test reputation updates across contracts
- Test treasury fee collection and distribution

### Invariant Testing

```solidity
// Example invariants to test:
// 1. Sum of all user balances == contract balance
// 2. Total staked == sum of individual stakes
// 3. Protocol fees always >= 0
// 4. Reputation scores always 0-100
```

---

## Deployment Script

```solidity
// script/Deploy.s.sol
contract DeployAll is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Treasury
        Treasury treasury = new Treasury();

        // 2. Deploy ReputationEngine
        ReputationEngine reputation = new ReputationEngine();

        // 3. Deploy CTDraft
        CTDraft draft = new CTDraft(address(reputation));

        // 4. Deploy TimecasterArena
        TimecasterArena arena = new TimecasterArena(
            address(treasury),
            address(reputation)
        );

        // 5. Deploy DailyGauntlet
        DailyGauntlet gauntlet = new DailyGauntlet(
            address(treasury),
            address(reputation)
        );

        // 6. Deploy ForesightNFT
        ForesightNFT nft = new ForesightNFT(address(reputation));

        // 7. Set contract addresses in ReputationEngine
        reputation.setContracts(
            address(arena),
            address(gauntlet),
            address(draft)
        );

        // 8. Set keeper address (backend wallet)
        address keeper = vm.envAddress("KEEPER_ADDRESS");
        arena.setKeeper(keeper);
        gauntlet.setKeeper(keeper);
        reputation.setKeeper(keeper);

        vm.stopBroadcast();

        // Print addresses
        console.log("Treasury:", address(treasury));
        console.log("ReputationEngine:", address(reputation));
        console.log("CTDraft:", address(draft));
        console.log("TimecasterArena:", address(arena));
        console.log("DailyGauntlet:", address(gauntlet));
        console.log("ForesightNFT:", address(nft));
    }
}
```

---

## Upgrade Strategy (Post-MVP)

**Use Transparent Proxy Pattern:**

```
User → TransparentProxy → Implementation Contract
```

**Benefits:**
- Fix bugs without redeploying
- Add features without losing state
- Maintain same contract address

**Risks:**
- Complexity increases
- Storage layout must be preserved
- Requires multi-sig governance

**Recommendation:** Launch MVP without upgrades, add proxies in V2 after audit.

---

## Security Checklist

- [ ] All functions have access control
- [ ] No reentrancy vulnerabilities (use CEI pattern)
- [ ] Integer overflow/underflow protected (Solidity 0.8+)
- [ ] No floating point math (use basis points)
- [ ] Timestamp manipulation considered
- [ ] Front-running mitigated where necessary
- [ ] Emergency pause mechanism
- [ ] Rate limiting on expensive operations
- [ ] Input validation on all external calls
- [ ] Events emitted for all state changes
- [ ] No unbounded loops
- [ ] Gas limits considered for all operations

---

## Next Steps

1. Implement all 6 contracts in `/contracts/src/`
2. Write comprehensive tests (>90% coverage)
3. Deploy to Base Sepolia testnet
4. Integrate with backend keeper services
5. Connect frontend to contracts via wagmi
6. Audit before mainnet (optional for MVP, required for V2)

See `DATABASE_SCHEMA.md` for off-chain data architecture.
