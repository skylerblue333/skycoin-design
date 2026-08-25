export type TokenValue = string | number;

export type DesignToken = {
  name: string;
  value: TokenValue;
  description?: string;
};

export type ResolvedToken = DesignToken & {
  resolvedValue: TokenValue;
};

const MAX_TOKENS = 10000;
const MAX_NAME_LENGTH = 128;
const MAX_STRING_LENGTH = 4096;
const TOKEN_NAME = /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/;
const ALIAS = /^\{([a-z][a-z0-9]*(?:[.-][a-z0-9]+)*)\}$/;

/** Validate, index, and resolve exact-token aliases like `{color.primary}`. */
export function resolveDesignTokens(tokens: DesignToken[]): ResolvedToken[] {
  if (!Array.isArray(tokens)) throw new TypeError("tokens must be an array");
  if (tokens.length > MAX_TOKENS) throw new RangeError(`at most ${MAX_TOKENS} tokens are allowed`);

  const index = new Map<string, DesignToken>();
  for (const token of tokens) {
    const normalized = normalizeToken(token);
    if (index.has(normalized.name)) throw new TypeError(`duplicate token name: ${normalized.name}`);
    index.set(normalized.name, normalized);
  }

  return [...index.values()]
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((token) => ({ ...token, resolvedValue: resolveValue(token.name, index, new Set()) }));
}

/** Convert resolved tokens into a plain immutable-friendly lookup snapshot. */
export function tokenMap(tokens: ResolvedToken[]): Record<string, TokenValue> {
  const result: Record<string, TokenValue> = {};
  for (const token of tokens) result[token.name] = token.resolvedValue;
  return result;
}

function normalizeToken(token: DesignToken): DesignToken {
  if (typeof token !== "object" || token === null) throw new TypeError("token must be an object");
  if (typeof token.name !== "string" || token.name.length === 0 || token.name.length > MAX_NAME_LENGTH || !TOKEN_NAME.test(token.name)) {
    throw new TypeError("token name must use lowercase dot/dash segments");
  }
  if (typeof token.value !== "string" && typeof token.value !== "number") {
    throw new TypeError("token value must be a string or number");
  }
  if (typeof token.value === "number" && !Number.isFinite(token.value)) {
    throw new TypeError("numeric token values must be finite");
  }
  if (typeof token.value === "string" && token.value.length > MAX_STRING_LENGTH) {
    throw new RangeError(`string token values must be at most ${MAX_STRING_LENGTH} characters`);
  }
  if (token.description !== undefined && (typeof token.description !== "string" || token.description.length > 1000)) {
    throw new TypeError("token description must be at most 1000 characters");
  }
  return { ...token };
}

function resolveValue(name: string, index: Map<string, DesignToken>, visiting: Set<string>): TokenValue {
  if (visiting.has(name)) throw new TypeError(`token alias cycle detected at: ${name}`);
  const token = index.get(name);
  if (!token) throw new TypeError(`unknown token: ${name}`);
  if (typeof token.value !== "string") return token.value;

  const match = token.value.match(ALIAS);
  if (!match) return token.value;
  const target = match[1];
  if (!target || !index.has(target)) throw new TypeError(`unknown token alias: ${token.value}`);

  const next = new Set(visiting);
  next.add(name);
  return resolveValue(target, index, next);
}
