import { Octokit } from '@octokit/rest';
import { getToken } from './utils/config.js';
let octokitInstance = null;
/**
 * Get authenticated Octokit client (singleton)
 */
export async function getOctokit() {
    if (octokitInstance) {
        return octokitInstance;
    }
    const token = await getToken();
    octokitInstance = new Octokit({
        auth: token,
        retry: {
            enabled: true,
            retries: 3,
        },
        request: {
            timeout: 10000,
        },
    });
    return octokitInstance;
}
/**
 * Parse repository string (owner/repo) into parts
 */
export function parseRepo(repoString) {
    const parts = repoString.split('/');
    if (parts.length !== 2) {
        throw new Error(`Invalid repository format: "${repoString}". Expected format: owner/repo`);
    }
    return { owner: parts[0], repo: parts[1] };
}
/**
 * Handle GitHub API errors with retry logic
 */
export async function withRetry(fn, retries = 3) {
    let lastError = null;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            // Don't retry on auth errors or client errors (4xx)
            if (error instanceof Error && 'status' in error) {
                const status = error.status;
                if (status && status >= 400 && status < 500) {
                    throw error;
                }
            }
            // Exponential backoff
            if (i < retries - 1) {
                const delay = Math.pow(2, i) * 1000;
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError;
}
//# sourceMappingURL=github.js.map