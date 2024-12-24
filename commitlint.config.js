module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\[\w*\])(?:\(([\u4e00-\u9fa5\w$.\-*/ ]*)\))?: (.*)$/,
    },
  },
  // https://cf.ge.cn/pages/viewpage.action?pageId=45799867
  rules: {
    'subject-case': [2, 'never', []],
    'type-enum': [
      2,
      'always',
      [
        '[feature]',
        '[fix]',
        '[update]',
        '[docs]',
        '[style]',
        '[refactor]',
        '[test]',
        '[chore]',
        '[bump]',
      ],
    ],
  },
};