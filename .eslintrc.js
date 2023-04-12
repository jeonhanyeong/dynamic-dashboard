module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    React: true,
    google: true,
    mount: true,
    mountWithRouter: true,
    shallow: true,
    shallowWithRouter: true,
    context: true,
    expect: true,
    jsdom: true,
    JSX: true,
  },
  extends: [
    "airbnb", // or airbnb-base
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended", // 설치 한경우
    "plugin:import/errors", // 설치한 경우
    "plugin:import/warnings", // 설치한 경우
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "eslint:recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "prettier/prettier": 0,
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [
      0,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "react/function-component-definition": [
      2,
      { namedComponents: "arrow-function" },
    ], // 컴포넌트는 화살표 함수로 작성
    "react/jsx-props-no-spreading": [0], // props는 spereading 가능
    "no-nested-ternary": "off", // 중첩된 삼항식 사용 가능
    "import/no-cycle": [0], // 모듈 양방향 의존 사용 가능
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "no-unused-vars": [1],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
  },
};
