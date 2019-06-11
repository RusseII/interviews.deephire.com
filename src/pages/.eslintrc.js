module.exports = {
  "extends": ["airbnb", "plugin:prettier/recommended", "prettier/react"],
  "plugins": ["prettier", "react-hooks"],
  "rules": {
    "prettier/prettier": ["error"],
    "react-hooks/rules-of-hooks": "error",
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
  },
  "env": {
    "browser": true,
    "commonjs": true,
    "node": true,
    "es6": true
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  }
}
