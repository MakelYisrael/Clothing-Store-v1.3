export function stripUndefined<T>(input: T): T {
  if (input === null || typeof input !== 'object') return input;
  if (Array.isArray(input)) return input.map(stripUndefined) as unknown as T;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(input as Record<string, any>)) {
    if (v !== undefined) {
      out[k] = stripUndefined(v);
    }
  }
  return out as T;
}
