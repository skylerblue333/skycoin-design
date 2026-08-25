export type DesignTokenValue = string | number;

export interface DesignTokenSetInput {
  readonly colors?: Readonly<Record<string, string>>;
  readonly spacing?: Readonly<Record<string, number>>;
  readonly radius?: Readonly<Record<string, number>>;
  readonly fontSize?: Readonly<Record<string, number>>;
}

export interface DesignTokenSet {
  readonly colors: Readonly<Record<string, string>>;
  readonly spacing: Readonly<Record<string, number>>;
  readonly radius: Readonly<Record<string, number>>;
  readonly fontSize: Readonly<Record<string, number>>;
}

const TOKEN_NAME = /^[a-z][a-z0-9.-]{0,63}$/;
const HEX_COLOR = /^#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/;
const MAX_TOKENS_PER_GROUP = 256;

export function normalizeDesignTokens(input: DesignTokenSetInput): DesignTokenSet {
  return Object.freeze({
    colors: Object.freeze(normalizeColors(input.colors ?? {})),
    spacing: Object.freeze(normalizeNumbers(input.spacing ?? {}, 0, 128, "spacing")),
    radius: Object.freeze(normalizeNumbers(input.radius ?? {}, 0, 64, "radius")),
    fontSize: Object.freeze(normalizeNumbers(input.fontSize ?? {}, 8, 96, "font size")),
  });
}

export function cssVariables(tokens: DesignTokenSet): string {
  const lines: string[] = [];
  for (const [name, value] of Object.entries(tokens.colors)) lines.push(`--color-${name}: ${value};`);
  for (const [name, value] of Object.entries(tokens.spacing)) lines.push(`--space-${name}: ${value}px;`);
  for (const [name, value] of Object.entries(tokens.radius)) lines.push(`--radius-${name}: ${value}px;`);
  for (const [name, value] of Object.entries(tokens.fontSize)) lines.push(`--font-size-${name}: ${value}px;`);
  return lines.join("\n");
}

function normalizeColors(values: Readonly<Record<string, string>>): Record<string, string> {
  checkCount(values, "colors");
  const result: Record<string, string> = {};
  for (const key of Object.keys(values).sort()) {
    validateName(key);
    const value = values[key];
    if (typeof value !== "string" || !HEX_COLOR.test(value)) throw new Error(`invalid color token: ${key}`);
    result[key] = value.toUpperCase();
  }
  return result;
}

function normalizeNumbers(values: Readonly<Record<string, number>>, min: number, max: number, label: string): Record<string, number> {
  checkCount(values, label);
  const result: Record<string, number> = {};
  for (const key of Object.keys(values).sort()) {
    validateName(key);
    const value = values[key];
    if (!Number.isFinite(value) || value < min || value > max) throw new Error(`${label} token ${key} must be between ${min} and ${max}`);
    result[key] = value;
  }
  return result;
}

function validateName(name: string): void {
  if (!TOKEN_NAME.test(name)) throw new Error(`invalid token name: ${name}`);
}

function checkCount(values: object, label: string): void {
  if (Object.keys(values).length > MAX_TOKENS_PER_GROUP) throw new Error(`${label} token capacity exceeded`);
}
