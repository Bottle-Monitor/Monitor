module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-full-stop': [0], // 允许主题末尾使用句号
    'header-max-length': [2, 'always', 306] // 允许标题的最大长度为 106，并启用错误级别检查
  },
}
