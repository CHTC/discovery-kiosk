import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat configs, so no FlatCompat shim.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Don't lint build output, generated files, or static assets — source only.
  globalIgnores([
    ".next/**",
    "out/**",
    "node_modules/**",
    "public/**",
    ".unlighthouse/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
