// 高版本的 eslint 暂无法和 vscode 中的插件 ESLint 兼容，故本项目模板暂且使用低版本的 eslint 和 4.x 版本的 typescript
module.exports = {
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  },
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:vue/vue3-strongly-recommended', 'standard'],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/no-mutating-props': 'off'
  },
  overrides: [
    {
      files: ['packages/**/*'],
      rules: {
        camelcase: 'off'
      }
    }
  ]
}
