import type { Tasting } from '../types';

export type Milestone = {
  id: string;
  label: string;
  hint: string;
  reached: (tastings: Tasting[]) => boolean;
};

export const milestones: Milestone[] = [
  {
    id: 'first',
    label: 'First pour',
    hint: 'Your first tasting',
    reached: (tastings) => tastings.length >= 1,
  },
  {
    id: 'ten',
    label: 'Ten pours',
    hint: 'Ten tastings logged',
    reached: (tastings) => tastings.length >= 10,
  },
  {
    id: 'styles',
    label: 'Style explorer',
    hint: 'Three different styles',
    reached: (tastings) => new Set(tastings.map((tasting) => tasting.type)).size >= 3,
  },
  {
    id: 'flavours',
    label: 'Flavour hunter',
    hint: 'Six flavours noted',
    reached: (tastings) => new Set(tastings.flatMap((tasting) => tasting.flavors)).size >= 6,
  },
  {
    id: 'sour',
    label: 'Sour adventurer',
    hint: 'A sour and wild pour',
    reached: (tastings) => tastings.some((tasting) => tasting.type === 'Sour & wild'),
  },
  {
    id: 'perfect',
    label: 'Perfect pour',
    hint: 'A five-glass score',
    reached: (tastings) => tastings.some((tasting) => Number(tasting.score) >= 5),
  },
];

export function earnedMilestones(tastings: Tasting[]): string[] {
  return milestones.filter((milestone) => milestone.reached(tastings)).map((milestone) => milestone.id);
}

export function milestoneLabel(id: string): string {
  return milestones.find((milestone) => milestone.id === id)?.label || id;
}
