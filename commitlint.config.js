module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["docs", "feat", "fix", "refactor", "style", "test", "chore"],
    ],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "scope-enum": [
      2,
      "always",
      ["builtins", "lib", "components", "services", "tests"],
    ],
  },
};
