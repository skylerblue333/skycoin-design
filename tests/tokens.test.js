const assert = require("node:assert/strict");
const { resolveDesignTokens, tokenMap } = require("../dist/index");

const resolved = resolveDesignTokens([
  { name: "space.sm", value: 8 },
  { name: "space.card", value: "{space.sm}" },
  { name: "color.text", value: "#111827", description: "Primary text" },
  { name: "color.heading", value: "{color.text}" },
]);

assert.deepEqual(resolved.map((token) => token.name), ["color.heading", "color.text", "space.card", "space.sm"]);
assert.deepEqual(tokenMap(resolved), {
  "color.heading": "#111827",
  "color.text": "#111827",
  "space.card": 8,
  "space.sm": 8,
});

assert.throws(() => resolveDesignTokens([{ name: "Bad Name", value: 1 }]), /token name/);
assert.throws(() => resolveDesignTokens([{ name: "space.sm", value: 1 }, { name: "space.sm", value: 2 }]), /duplicate token/);
assert.throws(() => resolveDesignTokens([{ name: "space.bad", value: Number.NaN }]), /finite/);
assert.throws(() => resolveDesignTokens([{ name: "color.a", value: "{color.missing}" }]), /unknown token alias/);
assert.throws(() => resolveDesignTokens([
  { name: "color.a", value: "{color.b}" },
  { name: "color.b", value: "{color.a}" },
]), /cycle/);

console.log("design token tests passed");
