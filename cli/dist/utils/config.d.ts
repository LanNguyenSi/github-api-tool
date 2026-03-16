export interface Config {
    token: string;
    defaultOwner?: string;
    defaultRepo?: string;
}
/**
 * Load config from file or environment variable
 */
export declare function loadConfig(): Promise<Config>;
/**
 * Save config to file
 */
export declare function saveConfig(config: Config): Promise<void>;
/**
 * Get token (with helpful error message if missing)
 */
export declare function getToken(): Promise<string>;
//# sourceMappingURL=config.d.ts.map