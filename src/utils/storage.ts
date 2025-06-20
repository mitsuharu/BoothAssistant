import AsyncStorage from '@react-native-async-storage/async-storage'
import type { HistoryItem } from '@/types/history'

const HISTORY_KEY = 'question_history'

export const saveHistory = async (history: HistoryItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Failed to save history:', error)
  }
}

export const loadHistory = async (): Promise<HistoryItem[]> => {
  try {
    const historyString = await AsyncStorage.getItem(HISTORY_KEY)
    return historyString ? JSON.parse(historyString) : []
  } catch (error) {
    console.error('Failed to load history:', error)
    return []
  }
}

export const addHistoryItem = async (item: HistoryItem): Promise<void> => {
  try {
    const currentHistory = await loadHistory()
    const updatedHistory = [item, ...currentHistory]
    await saveHistory(updatedHistory)
  } catch (error) {
    console.error('Failed to add history item:', error)
  }
}
