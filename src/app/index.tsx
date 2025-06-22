import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/Button'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import type { HistoryItem } from '@/types/history'
import { loadHistory, removeHistoryItem } from '@/utils/storage'
import { styleType } from '@/utils/styles'

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
  const renderHistoryItem = useCallback(
    ({ item }: { item: HistoryItem }) => (
      <View style={styles.itemContainer}>
        <Button
          style={styles.historyItem}
          onPress={() => onHistoryItemPress(item)}
          onLongPress={() => onDeleteItem(item)}
        >
          <View style={styles.itemContent}>
            <ThemedText style={styles.questionText} numberOfLines={2}>
              {item.question}
            </ThemedText>
            <ThemedText style={styles.timestampText}>
              {new Date(item.timestamp).toLocaleString('ja-JP')}
            </ThemedText>
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
    [onHistoryItemPress, onDeleteItem],
  )

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>読み込み中...</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.historyContainer}>
        {history.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              まだ質問履歴がありません
            </ThemedText>
          </ThemedView>
        ) : (
          <FlashList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            estimatedItemSize={80}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ThemedView>

      <SafeAreaView>
        <ThemedView style={styles.buttonContainer}>
          <Button
            style={styles.inputButton}
            onPress={onInputPress}
            text='新しい質問をする'
            textStyle={styles.inputButtonText}
          />
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
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

const styles = StyleSheet.create({
  container: styleType<ViewStyle>({
    flex: 1,
    padding: 16,
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
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  }),
  itemContent: styleType<ViewStyle>({
    flex: 1,
  }),
  questionText: styleType<TextStyle>({
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  }),
  timestampText: styleType<TextStyle>({
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
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  }),
  inputButtonText: styleType<TextStyle>({
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }),
})

export default MainContainer
