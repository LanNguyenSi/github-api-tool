import { subDays, formatISO, parseISO, format } from 'date-fns';
import { getOctokit, withRetry } from '../github.js';
import { output, error as outputError } from '../utils/output.js';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchReposForOwner(owner, octokit) {
    // Try as org first, fall back to user
    try {
        const result = await withRetry(async () => octokit.rest.repos.listForOrg({ org: owner, per_page: 100, sort: 'pushed' }));
        return result.data.map((r) => r.name);
    }
    catch {
        const result = await withRetry(async () => octokit.rest.repos.listForUser({ username: owner, per_page: 100, sort: 'pushed' }));
        return result.data.map((r) => r.name);
    }
}
export function registerStandupCommands(program) {
    program
        .command('standup')
        .description('Daily standup digest — show commits across repos for a time range')
        .requiredOption('-o, --owner <owner>', 'GitHub username or organization')
        .option('-r, --repos <repos...>', 'Specific repos to check (default: all repos for owner)')
        .option('-d, --days <number>', 'How many days back to look', '1')
        .option('-a, --author <author>', 'Filter commits by author (GitHub username)')
        .option('--json', 'Output as JSON')
        .action(async (opts) => {
        try {
            const octokit = await getOctokit();
            const days = parseInt(opts.days, 10);
            const since = formatISO(subDays(new Date(), days));
            let repos = opts.repos ?? [];
            if (repos.length === 0) {
                repos = await fetchReposForOwner(opts.owner, octokit);
            }
            const results = [];
            for (const repo of repos) {
                try {
                    const params = {
                        owner: opts.owner,
                        repo,
                        since,
                        per_page: 100,
                    };
                    if (opts.author)
                        params.author = opts.author;
                    const result = await withRetry(async () => octokit.rest.repos.listCommits(params));
                    const commits = result.data.map((c) => ({
                        sha: c.sha.substring(0, 7),
                        message: c.commit.message.split('\n')[0],
                        author: c.commit.author?.name ?? 'unknown',
                        date: c.commit.author?.date ?? '',
                        url: c.html_url,
                    }));
                    results.push({ repo, commits });
                }
                catch (err) {
                    const msg = err instanceof Error ? err.message : String(err);
                    results.push({ repo, commits: [], error: msg });
                }
            }
            if (opts.json) {
                output(results, { json: true });
                return;
            }
            // Pretty print
            const label = days === 1 ? 'yesterday' : `last ${days} days`;
            console.log(`\n📋 Git Standup — ${opts.owner} (${label})\n`);
            let totalCommits = 0;
            for (const { repo, commits, error } of results) {
                if (error) {
                    console.log(`  ⚠ ${repo}: ${error}`);
                    continue;
                }
                if (commits.length === 0)
                    continue;
                totalCommits += commits.length;
                console.log(`  📁 ${repo} (${commits.length})`);
                for (const c of commits) {
                    const time = c.date ? format(parseISO(c.date), 'HH:mm') : '??:??';
                    console.log(`    ${time} ${c.sha} ${c.message}`);
                }
                console.log();
            }
            if (totalCommits === 0) {
                console.log('  No commits found.\n');
            }
            else {
                console.log(`Total: ${totalCommits} commit(s)\n`);
            }
        }
        catch (err) {
            outputError('Standup failed', err);
            process.exit(1);
        }
    });
}
//# sourceMappingURL=standup.js.map