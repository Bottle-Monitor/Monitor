import antfu from '@antfu/eslint-config'

export default antfu({
  globals: {},
  rules: {
    'no-console': 'off',
    'unused-imports/no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
    'node/prefer-global/process': 'off',
    'no-restricted-globals': ['warn'],
  },
})
