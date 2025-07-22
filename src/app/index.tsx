import { Ionicons } from '@expo/vector-icons'
import { Button, styleType } from '@mitsuharu/react-native-components-plus'
import { FlashList } from '@shopify/flash-list'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  type TextStyle,
  useColorScheme,
  View,
  type ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { makeStyles } from 'react-native-swag-styles'
import { COLOR } from '@/constants/Colors'
import type { HistoryItem } from '@/types/history'
import { loadHistory, removeHistoryItem } from '@/utils/storage'

type MainComponentProps = {
  history: HistoryItem[]
  isLoading: boolean
  onHistoryItemPress: (item: HistoryItem) => void
  onInputPress: () => void
  onDeleteItem: (item: HistoryItem) => void
}

type Props = MainComponentProps & {}

const MainComponent: React.FC<MainComponentProps> = ({
  history,
  isLoading,
  onHistoryItemPress,
  onInputPress,
  onDeleteItem,
}) => {
  const styles = useStyles()

  const renderHistoryItem = useCallback(
    ({ item }: { item: HistoryItem }) => (
      <View style={styles.itemContainer}>
        <Button
          style={styles.historyItem}
          onPress={() => onHistoryItemPress(item)}
          onLongPress={() => onDeleteItem(item)}
        >
          <View style={styles.itemContent}>
            <Text style={styles.questionText} numberOfLines={2}>
              {item.question}
            </Text>
            <Text style={styles.timestampText}>
              {new Date(item.timestamp).toLocaleString('ja-JP')}
            </Text>
          </View>
          <Button
            style={styles.deleteButton}
            onPress={() => onDeleteItem(item)}
          >
            <Ionicons name='trash' size={20} color='#FF3B30' />
          </Button>
        </Button>
      </View>
    ),
    [onHistoryItemPress, onDeleteItem, styles],
  )

  const keyExtractor = useCallback((item: HistoryItem) => item.id, [])

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>読み込み中...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.historyContainer}>
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>まだ質問履歴がありません</Text>
          </View>
        ) : (
          <FlashList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={80}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <SafeAreaView>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.inputButton}
            onPress={onInputPress}
            text='新しい質問をする'
            textStyle={styles.inputButtonText}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

const MainContainer: React.FC<Props> = (props) => {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadHistoryData = useCallback(async () => {
    try {
      const historyData = await loadHistory()
      setHistory(historyData)
    } catch {
      Alert.alert('エラー', '履歴の読み込みに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHistoryData()
  }, [loadHistoryData])

  useFocusEffect(
    useCallback(() => {
      loadHistoryData()
    }, [loadHistoryData]),
  )

  const onHistoryItemPress = useCallback(
    (item: HistoryItem) => {
      router.push({
        pathname: '/result',
        params: {
          question: item.question,
          answer: item.answer,
          timestamp: item.timestamp.toString(),
        },
      })
    },
    [router],
  )

  const onInputPress = useCallback(() => {
    router.push('/input')
  }, [router])

  const onDeleteItem = useCallback(
    async (item: HistoryItem) => {
      Alert.alert('確認', 'この質問履歴を削除しますか？', [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeHistoryItem(item.id)
              await loadHistoryData()
            } catch {
              Alert.alert('エラー', '履歴の削除に失敗しました')
            }
          },
        },
      ])
    },
    [loadHistoryData],
  )

  return (
    <MainComponent
      {...props}
      {...{
        history,
        isLoading,
        onHistoryItemPress,
        onInputPress,
        onDeleteItem,
      }}
    />
  )
}

const useStyles = makeStyles(useColorScheme, (colorScheme) => {
  const styles = StyleSheet.create({
    container: styleType<ViewStyle>({
      flex: 1,
      padding: 16,
      backgroundColor: COLOR(colorScheme).BACKGROUND.SECONDARY,
    }),
    header: styleType<ViewStyle>({
      marginBottom: 16,
    }),
    historyContainer: styleType<ViewStyle>({
      flex: 1,
      marginBottom: 16,
    }),
    emptyContainer: styleType<ViewStyle>({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }),
    emptyText: styleType<TextStyle>({
      fontSize: 16,
      opacity: 0.6,
    }),
    itemContainer: styleType<ViewStyle>({
      marginBottom: 8,
    }),
    historyItem: styleType<ViewStyle>({
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 8,
      backgroundColor: COLOR(colorScheme).BACKGROUND.PRIMARY,
      borderWidth: 1,
      borderColor: COLOR(colorScheme).TEXT.SECONDARY,
    }),
    itemContent: styleType<ViewStyle>({
      flex: 1,
    }),
    questionText: styleType<TextStyle>({
      color: COLOR(colorScheme).TEXT.PRIMARY,
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
    }),
    timestampText: styleType<TextStyle>({
      color: COLOR(colorScheme).TEXT.SECONDARY,
      fontSize: 12,
      opacity: 0.6,
    }),
    deleteButton: styleType<ViewStyle>({
      padding: 8,
      marginLeft: 12,
      borderRadius: 6,
      backgroundColor: 'transparent',
    }),
    buttonContainer: styleType<ViewStyle>({
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
    }),
    inputButton: styleType<ViewStyle>({
      backgroundColor: COLOR(colorScheme).BACKGROUND.EMPHASIZE,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    }),
    inputButtonText: styleType<TextStyle>({
      color: COLOR(colorScheme).TEXT.EMPHASIZE,
      fontSize: 16,
      fontWeight: '600',
    }),
  })
  return styles
})

export default MainContainer
