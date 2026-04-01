import { Octokit } from '@octokit/rest';
/**
 * Get authenticated Octokit client (singleton)
 */
export declare function getOctokit(): Promise<Octokit>;
/**
 * Parse repository string (owner/repo) into parts
 */
export declare function parseRepo(repoString: string): {
    owner: string;
    repo: string;
};
/**
 * Handle GitHub API errors with retry logic
 */
export declare function withRetry<T>(fn: () => Promise<T>, retries?: number, baseDelayMs?: number): Promise<T>;
//# sourceMappingURL=github.d.ts.map