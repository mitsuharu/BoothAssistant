import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import type { HistoryItem } from '@/types/history'
import { loadHistory, removeHistoryItem } from '@/utils/storage'

export default function MainScreen() {
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

  const handleHistoryItemPress = useCallback(
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

  const handleInputPress = useCallback(() => {
    router.push('/input')
  }, [router])

  const handleDeleteItem = useCallback(
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

  const renderHistoryItem = useCallback(
    ({ item }: { item: HistoryItem }) => (
      <View style={styles.itemContainer}>
        <Pressable
          style={styles.historyItem}
          onPress={() => handleHistoryItemPress(item)}
          onLongPress={() => handleDeleteItem(item)}
        >
          <View style={styles.itemContent}>
            <ThemedText style={styles.questionText} numberOfLines={2}>
              {item.question}
            </ThemedText>
            <ThemedText style={styles.timestampText}>
              {new Date(item.timestamp).toLocaleString('ja-JP')}
            </ThemedText>
          </View>
          <Pressable
            style={styles.deleteButton}
            onPress={() => handleDeleteItem(item)}
          >
            <Ionicons name='trash' size={20} color='#FF3B30' />
          </Pressable>
        </Pressable>
      </View>
    ),
    [handleHistoryItemPress, handleDeleteItem],
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
      <ThemedView style={styles.header}>
        <ThemedText type='title'>質問履歴</ThemedText>
      </ThemedView>

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

      <ThemedView style={styles.buttonContainer}>
        <Pressable style={styles.inputButton} onPress={handleInputPress}>
          <Text style={styles.inputButtonText}>新しい質問をする</Text>
        </Pressable>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  historyContainer: {
    flex: 1,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
  itemContainer: {
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemContent: {
    flex: 1,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 12,
    opacity: 0.6,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  buttonContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  inputButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
