/**
 * Structured JSON error responses for API routes. Agents can't parse HTML
 * error pages, so every API error carries a stable code, a human-readable
 * message, and a hint for resolving it.
 */
export function jsonError(
  status: number,
  code: string,
  message: string,
  hint?: string,
  headers?: Record<string, string>
): Response {
  return new Response(
    JSON.stringify({
      message,
      error: { code, message, ...(hint ? { hint } : {}) }
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...headers
      }
    }
  );
}
