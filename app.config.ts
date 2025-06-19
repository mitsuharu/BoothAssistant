import type { ConfigContext } from '@expo/config'

export default ({ config }: ConfigContext) => {
  config.extra = {
    ...config.extra,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  }
  return config
}
