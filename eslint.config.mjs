import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  // 기본 무시 패턴
  { ignores: ["dist", "node_modules", "*.config.{js,ts,mjs}"] },

  // JavaScript 권장 규칙
  js.configs.recommended,

  // TypeScript 권장 규칙
  ...tseslint.configs.recommended,

  // React 설정
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // React Hooks 규칙
      ...reactHooks.configs.recommended.rules,

      // React Refresh 규칙
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // TypeScript 규칙 조정
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Prettier 규칙 충돌 방지 (반드시 마지막에 위치)
  prettier
);
