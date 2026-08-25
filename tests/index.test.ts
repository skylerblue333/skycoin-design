import { describe, expect, it } from "vitest";
import { cssVariables, normalizeDesignTokens } from "../src/index";

describe("design tokens", () => {
  it("normalizes deterministic token groups", () => {
    const tokens = normalizeDesignTokens({
      colors: { primary: "#1a2b3c", surface: "#FFFFFF" },
      spacing: { md: 16, sm: 8 },
      radius: { card: 12 },
      fontSize: { body: 16 },
    });
    expect(tokens.colors).toEqual({ primary: "#1A2B3C", surface: "#FFFFFF" });
    expect(Object.keys(tokens.spacing)).toEqual(["md", "sm"]);
    expect(Object.isFrozen(tokens)).toBe(true);
  });

  it("renders stable CSS variable output", () => {
    const tokens = normalizeDesignTokens({ colors: { primary: "#000000" }, spacing: { sm: 8 } });
    expect(cssVariables(tokens)).toBe("--color-primary: #000000;\n--space-sm: 8px;");
  });

  it("rejects malformed colors and token names", () => {
    expect(() => normalizeDesignTokens({ colors: { primary: "red" } })).toThrow("invalid color token");
    expect(() => normalizeDesignTokens({ spacing: { "Bad Name": 8 } })).toThrow("invalid token name");
  });

  it("enforces numeric design bounds", () => {
    expect(() => normalizeDesignTokens({ spacing: { huge: 129 } })).toThrow("spacing token");
    expect(() => normalizeDesignTokens({ radius: { negative: -1 } })).toThrow("radius token");
    expect(() => normalizeDesignTokens({ fontSize: { tiny: 7 } })).toThrow("font size token");
  });
});
