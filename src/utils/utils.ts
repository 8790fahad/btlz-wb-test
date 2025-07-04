
export function parseLocalizedFloat(input: string | undefined, fallback: number = 0): number {
    if (!input || input.trim() === "-" || input.trim() === "") return fallback;
    const normalized = input.replace(",", ".").trim();
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? fallback : parsed;
}