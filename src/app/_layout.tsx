import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { Pressable, View } from 'react-native'

export default function RootLayout() {
  const router = useRouter()

  const settingButton = useMemo(
    () => (
      <View style={{ width: 44, height: 'auto' }}>
        <Pressable
          onPress={() => router.push('/settings')}
          style={{
            paddingHorizontal: 8,
          }}
        >
          <Ionicons name='settings' size={18} color='#007AFF' />
        </Pressable>
      </View>
    ),
    [router.push],
  )

  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: '質問履歴',
          headerBackVisible: false,
          headerRight: () => settingButton,
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
