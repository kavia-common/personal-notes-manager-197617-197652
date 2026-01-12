/** Generate a reasonably unique id for client-side usage. */
export function createId(prefix = 'note'): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
