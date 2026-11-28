import type { DuelVote, Tasting } from '../types';

export type DuelStat = {
  id: string;
  name: string;
  wins: number;
  losses: number;
  rate: number;
};

/** A personal preference ladder built only from your own comparisons. */
export function duelStats(votes: DuelVote[], tastings: Tasting[]): DuelStat[] {
  const names = new Map(tastings.map((tasting) => [tasting.id, tasting.name]));
  const stats = new Map<string, { wins: number; losses: number }>();
  for (const vote of votes) {
    const winner = stats.get(vote.winnerId) || { wins: 0, losses: 0 };
    const loser = stats.get(vote.loserId) || { wins: 0, losses: 0 };
    winner.wins += 1;
    loser.losses += 1;
    stats.set(vote.winnerId, winner);
    stats.set(vote.loserId, loser);
  }
  return [...stats.entries()]
    .filter(([id]) => names.has(id))
    .map(([id, record]) => ({
      id,
      name: names.get(id) || id,
      wins: record.wins,
      losses: record.losses,
      rate: (record.wins + 1) / (record.wins + record.losses + 2),
    }))
    .sort((a, b) => b.rate - a.rate || b.wins - a.wins);
}

/** Pick two pours, preferring a pairing you have not compared yet. */
export function pickDuel(
  tastings: Tasting[],
  votes: DuelVote[],
  rng = Math.random,
): [Tasting, Tasting] | null {
  if (tastings.length < 2) return null;
  const compared = new Set(votes.map((vote) => [vote.winnerId, vote.loserId].sort().join('|')));
  const fresh: [Tasting, Tasting][] = [];
  for (let i = 0; i < tastings.length; i++) {
    for (let j = i + 1; j < tastings.length; j++) {
      const key = [tastings[i].id, tastings[j].id].sort().join('|');
      if (!compared.has(key)) fresh.push([tastings[i], tastings[j]]);
    }
  }
  const pool = fresh.length ? fresh : [[tastings[0], tastings[1]] as [Tasting, Tasting]];
  return pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];
}
