# Sky Design Tokens

A small TypeScript design-token validation and alias-resolution library for SKYCOIN4444 interfaces.

**Status: engineering beta.** This repository does not claim a complete UI component system, design application, deployed theme service, or production design platform.

## Implemented behavior

`resolveDesignTokens()` validates bounded token definitions, enforces lowercase dot/dash token names, rejects duplicate names and non-finite numbers, resolves exact aliases such as `{color.text}`, detects unknown aliases and cycles, and returns deterministic name ordering. `tokenMap()` converts resolved tokens to a plain value lookup.

```ts
import { resolveDesignTokens, tokenMap } from "skycoin4444-design-tokens";

const tokens = resolveDesignTokens([
  { name: "color.text", value: "#111827" },
  { name: "color.heading", value: "{color.text}" },
]);

console.log(tokenMap(tokens));
```

## Verification

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm audit --audit-level=high
pnpm pack
```

GitHub Actions performs real typecheck, tests, dependency audit, and package-smoke verification on Node.js 22. Previous scripts that only echoed successful verification were removed.

There is intentionally no Docker/database/JWT runtime because this product is a reusable library.

## Scope and limitations

Values are strings or finite numbers. Alias syntax resolves only a complete value that exactly matches `{token.name}`; interpolation, color parsing, unit conversion, theme inheritance, component rendering, CSS generation, Figma integration, accessibility auditing, persistence, and remote distribution are not implemented.

Historical experiment files remain in the repository for history but are excluded from the supported package build.

SKYCOIN4444 frontends can consume the resolved map through a stable design-system adapter while component libraries and accessibility behavior remain separate concerns.

## License

MIT, subject to the checked-in license and applicable third-party licenses.
