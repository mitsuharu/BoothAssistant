// metro.config.js
const { getDefaultConfig } = require('expo/metro-config')
const exclusionList = require('metro-config/src/defaults/exclusionList')

const config = getDefaultConfig(__dirname)

// ここで除外対象を指定
config.resolver.blacklistRE = exclusionList([
  /node_modules\/@anthropic-ai\/claude-code\/.*/,
])

module.exports = config
