import antfu from '@antfu/eslint-config'

export default antfu({
  globals: {},
  rules: {
    'no-console': 'off',
    'unused-imports/no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
    'node/prefer-global/process': 'off',
    'no-restricted-globals': ['warn'],
    // 放宽正则表达式相关规则
    'regexp/no-super-linear-backtracking': 'warn',
    'regexp/no-misleading-capturing-group': 'warn',
    'regexp/no-unused-capturing-group': 'warn',
    // 放宽 TypeScript 相关规则
    'ts/no-use-before-define': 'warn',
    'ts/no-this-alias': 'warn',
    // 放宽其他规则
    'no-unreachable-loop': 'warn',
    'no-unused-vars': 'warn',
    // 放宽 new 和 eval 相关规则
    'no-new': 'warn',
    'no-eval': 'warn',
  },
})
