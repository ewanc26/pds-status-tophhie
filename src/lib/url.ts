/**
 * URL validation helpers.
 *
 * The PDS `describeServer` response is remote, third-party data. Any URL taken
 * from it and placed into an `href` must be confirmed to be `http`/`https`
 * first, otherwise a `javascript:` or `data:` value becomes an executable link.
 */

const SAFE_PROTOCOLS = new Set(['http:', 'https:']);

/**
 * Returns the URL unchanged if it is a well-formed `http(s)` URL, otherwise
 * `null`. Callers should omit the link entirely when this returns `null`.
 */
export function safeHttpUrl(value: unknown): string | null {
	if (typeof value !== 'string' || value.length === 0) {
		return null;
	}

	try {
		const parsed = new URL(value);
		return SAFE_PROTOCOLS.has(parsed.protocol) ? value : null;
	} catch {
		return null;
	}
}
