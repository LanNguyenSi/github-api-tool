export function parsePositiveInteger(value, optionName) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`Invalid ${optionName}: "${value}". Expected a positive integer.`);
    }
    return parsed;
}
//# sourceMappingURL=args.js.map