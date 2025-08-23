module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'chore', 'refactor', 'test']],
    'scope-case': [0],
    'subject-case': [0],
  },
};
