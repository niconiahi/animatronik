import antfu from "@antfu/eslint-config"

export default antfu(
  {
    stylistic: {
      quotes: "double",
    },
    ignores: ["contracts/**"],
  },
  {
    files: ["**/*.ts"],
    rules: {
      "style/brace-style": ["error", "1tbs", { allowSingleLine: false }],
      "ts/consistent-type-imports": ["error", {
        disallowTypeAnnotations: true,
        prefer: "type-imports",
      }],
      "import/order": ["error", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "pathGroups": [
          {
            pattern: "@ethernauta/**",
            group: "internal",
          },
        ],
        "pathGroupsExcludedImportTypes": ["builtin"],
        "newlines-between": "always",
        "alphabetize": {
          order: "asc",
          caseInsensitive: true,
        },
      }],
      "no-nested-ternary": "error",
      "curly": ["error", "all"],
    },
  },
)
