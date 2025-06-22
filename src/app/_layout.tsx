import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { Pressable } from 'react-native'

export default function RootLayout() {
  const router = useRouter()

  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: '質問履歴',
          headerBackVisible: false,
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/settings')}
              style={{ padding: 8 }}
            >
              <Ionicons name='settings' size={24} color='#007AFF' />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name='input'
        options={{
          title: '質問入力',
        }}
      />
      <Stack.Screen
        name='result'
        options={{
          title: '回答結果',
        }}
      />
      <Stack.Screen
        name='settings'
        options={{
          title: '設定',
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}
