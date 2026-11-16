import { goto } from '$app/navigation';

export const pathFor = (id) => (id === 'overview' ? '/' : `/${id}`);

export function navigate(id) {
  goto(pathFor(id));
}
