export interface OutputOptions {
    json?: boolean;
}
/**
 * Format output as JSON or human-readable table
 */
export declare function output(data: unknown, options?: OutputOptions): void;
/**
 * Output success message
 */
export declare function success(message: string): void;
/**
 * Output error message
 */
export declare function error(message: string, err?: Error): void;
/**
 * Output warning message
 */
export declare function warn(message: string): void;
//# sourceMappingURL=output.d.ts.map