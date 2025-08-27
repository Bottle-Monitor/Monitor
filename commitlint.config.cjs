module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [0], // 不限制 scope 的大小写格式
    'scope-empty': [2, 'never'], // scope 可以为空
    'scope-enum': [0], // 不限制特定的 scope 列表，可以使用任何 scope
    'subject-full-stop': [0], // 允许主题末尾使用句号
  },
}
