// https://github.com/openai/openai-node
import OpenAI from 'openai'
import { useCallback } from 'react'

type AssistantType = {
  fetchResponse: (input: string) => Promise<string | undefined>
}

export const useAssistant = (): AssistantType => {
  const client = new OpenAI()

  const fetchResponse = useCallback(
    async (input: string) => {
      try {
        const response = await client.responses.create({
          model: 'gpt-4.1-nano',
          input: input,
          tools: [
            {
              type: 'mcp',
              server_label: 'yumemi-openhandbook',
              server_url: 'https://openhandbook.mcp.yumemi.jp/sse',
            },
          ],
        })
        return response.output_text
      } catch (error: any) {
        // https://github.com/openai/openai-node?tab=readme-ov-file#handling-errors
        console.warn(error)
        throw error
      }
    },
    [client],
  )

  return { fetchResponse }
}
