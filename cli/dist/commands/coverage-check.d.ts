import { Command } from 'commander';
export interface CoverageResult {
    pct: number;
    lines?: number;
    statements?: number;
    functions?: number;
    branches?: number;
    passed: boolean;
}
export declare function parseCoverageSummary(json: string, threshold: number): CoverageResult;
export declare function registerCoverageCheckCommands(program: Command): void;
//# sourceMappingURL=coverage-check.d.ts.map