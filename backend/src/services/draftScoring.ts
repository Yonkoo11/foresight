import db from '../utils/db';

/**
 * Draft Scoring Engine
 * Calculates daily scores for CT Draft fantasy teams
 */

/**
 * Calculate score for an influencer based on engagement
 * Formula: base_price + (follower_count / 1000000) * 10
 * This is a simplified formula since we don't have real engagement data yet
 */
function calculateInfluencerScore(influencer: any): number {
  const baseScore = influencer.base_price || 0;
  const followerBonus = (influencer.follower_count / 1000000) * 10;

  const totalScore = baseScore + followerBonus;

  return Math.round(totalScore * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate scores for all teams
 */
export async function calculateAllTeamScores(): Promise<void> {
  console.log('========================================');
  console.log('Draft Scoring Engine Starting');
  console.log('========================================');

  try {
    // Get all teams
    const teamsResult = await db.raw('SELECT * FROM ct_draft_teams');
    const teams = teamsResult.rows;

    console.log(`Calculating scores for ${teams.length} teams...`);

    for (const team of teams) {
      // Get influencers for this team
      const influencersResult = await db.raw(
        'SELECT * FROM influencers WHERE id = ANY($1::int[])',
        [team.influencer_ids]
      );
      const influencers = influencersResult.rows;

      // Calculate total score
      const totalScore = influencers.reduce((sum: number, inf: any) => {
        const score = calculateInfluencerScore(inf);
        return sum + score;
      }, 0);

      // Update team score (round to integer)
      await db.raw(
        `UPDATE ct_draft_teams
         SET total_score = $1, updated_at = NOW()
         WHERE id = $2`,
        [Math.round(totalScore), team.id]
      );

      console.log(`Team "${team.team_name}": ${totalScore} points`);
    }

    console.log('\n✅ Team scores calculated');
  } catch (error) {
    console.error('❌ Failed to calculate team scores:', error);
    throw error;
  }
}

/**
 * Calculate rankings for all teams
 */
export async function calculateTeamRankings(): Promise<void> {
  try {
    // Get all teams ordered by score
    const teamsResult = await db.raw(
      `SELECT id, total_score
       FROM ct_draft_teams
       ORDER BY total_score DESC NULLS LAST`
    );
    const teams = teamsResult.rows;

    console.log(`Calculating rankings for ${teams.length} teams...`);

    // Update ranks
    for (let i = 0; i < teams.length; i++) {
      await db.raw(
        'UPDATE ct_draft_teams SET rank = $1 WHERE id = $2',
        [i + 1, teams[i].id]
      );
    }

    console.log('✅ Team rankings calculated');
  } catch (error) {
    console.error('❌ Failed to calculate team rankings:', error);
    throw error;
  }
}

/**
 * Run complete scoring cycle
 */
export async function runDraftScoringCycle(): Promise<void> {
  console.log('========================================');
  console.log('Running Draft Scoring Cycle');
  console.log('========================================');

  try {
    // Step 1: Calculate team scores
    await calculateAllTeamScores();

    // Step 2: Calculate rankings
    await calculateTeamRankings();

    console.log('\n========================================');
    console.log('✅ Draft Scoring Cycle Complete');
    console.log('========================================\n');
  } catch (error) {
    console.error('❌ Draft scoring cycle failed:', error);
  }
}
