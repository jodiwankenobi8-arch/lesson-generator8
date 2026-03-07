import type { GeneratedLessonPlan } from '../types/lesson-schema';

export interface CenterRotation {
  round: number;
  groupName: string;
  centerName: string;
}

export interface CentersPlan {
  centers: string[];
  rounds: number;
  rotations: CenterRotation[];
  notes: string[];
}

/**
 * Simple centers planner:
 * - Uses your saved I/E group names (Tier 3/Tier 2/Enrichment)
 * - Builds a rotation schedule across 3 default centers
 *
 * This is intentionally lightweight for solo-use and can be customized later.
 */
export function buildCentersPlan(plan: GeneratedLessonPlan): CentersPlan {
  const centers = ['Read to Self', 'Word Work', 'Writing'];
  const rounds = 3;

  const groupNames: string[] = [];
  const ie = plan.ieSuggestions;
  const addNames = (arr?: Array<{ groupName: string }>) => {
    (arr || []).forEach(g => {
      if (g.groupName && !groupNames.includes(g.groupName)) groupNames.push(g.groupName);
    });
  };
  addNames(ie?.tier3);
  addNames(ie?.tier2);
  addNames(ie?.enrichment);

  if (!groupNames.length) groupNames.push('Group A', 'Group B', 'Group C');

  const rotations: CenterRotation[] = [];
  for (let r = 0; r < rounds; r++) {
    for (let gi = 0; gi < groupNames.length; gi++) {
      rotations.push({
        round: r + 1,
        groupName: groupNames[gi],
        centerName: centers[(gi + r) % centers.length],
      });
    }
  }

  return {
    centers,
    rounds,
    rotations,
    notes: [
      'Start Tier 3 with the teacher table first if you’re pulling groups during centers.',
      'Use a timer and explicitly teach “what to do when finished.”',
      'Print center task cards and keep them consistent week to week.',
    ],
  };
}
