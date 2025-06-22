import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { Pressable, useColorScheme, View } from 'react-native'
import { COLOR } from '@/constants/Colors'

export default function RootLayout() {
  const router = useRouter()
  const colorScheme = useColorScheme()

  const settingButton = useMemo(
    () => (
      <View style={{ width: 44, height: 'auto' }}>
        <Pressable
          onPress={() => router.push('/settings')}
          style={{
            paddingHorizontal: 8,
          }}
        >
          <Ionicons
            name='settings'
            size={18}
            color={COLOR(colorScheme).BACKGROUND.EMPHASIZE}
          />
        </Pressable>
      </View>
    ),
    [router.push],
  )

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLOR(colorScheme).BACKGROUND.PRIMARY,
        },
        headerTintColor: COLOR(colorScheme).TEXT.PRIMARY,
        headerTitleStyle: {
          color: COLOR(colorScheme).TEXT.PRIMARY,
        },
      }}
    >
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
