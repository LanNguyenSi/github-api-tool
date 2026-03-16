import { readFile, writeFile, mkdir } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync } from 'fs';
const CONFIG_DIR = join(homedir(), '.github-api-tool');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');
/**
 * Load config from file or environment variable
 */
export async function loadConfig() {
    // Priority 1: Environment variable
    const envToken = process.env.GITHUB_TOKEN;
    if (envToken) {
        return { token: envToken };
    }
    // Priority 2: Config file
    if (existsSync(CONFIG_FILE)) {
        try {
            const content = await readFile(CONFIG_FILE, 'utf-8');
            return JSON.parse(content);
        }
        catch (error) {
            throw new Error(`Failed to read config file: ${CONFIG_FILE}`);
        }
    }
    throw new Error('No GitHub token found. Set GITHUB_TOKEN environment variable or run: github config set-token <token>');
}
/**
 * Save config to file
 */
export async function saveConfig(config) {
    if (!existsSync(CONFIG_DIR)) {
        await mkdir(CONFIG_DIR, { recursive: true });
    }
    await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}
/**
 * Get token (with helpful error message if missing)
 */
export async function getToken() {
    const config = await loadConfig();
    if (!config.token) {
        throw new Error('GitHub token not configured');
    }
    return config.token;
}
//# sourceMappingURL=config.js.map