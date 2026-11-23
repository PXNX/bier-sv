import type { ViewId } from './types';

import { goto } from '$app/navigation';

export type { ViewId } from './types';

export const pathFor = (id: ViewId | string): string => (id === 'overview' ? '/' : `/${id}`);

export function navigate(id: ViewId | string): Promise<void> {
  return goto(pathFor(id));
}
