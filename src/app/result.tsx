import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useLocalSearchParams } from 'expo-router'
import * as Speech from 'expo-speech'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useAssistant } from '@/hooks/useAssistant'
import type { HistoryItem } from '@/types/history'
import { addHistoryItem } from '@/utils/storage'

type ResultComponentProps = {
  question: string
  currentAnswer: string
  isLoading: boolean
  isSpeaking: boolean
  onSpeech: () => void
  onGoBack: () => void
}

type Props = ResultComponentProps & {}

const ResultComponent: React.FC<ResultComponentProps> = ({
  question,
  currentAnswer,
  isLoading,
  isSpeaking,
  onSpeech,
  onGoBack,
}) => {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.questionContainer}>
          <ThemedText style={styles.sectionTitle}>質問</ThemedText>
          <ThemedView style={styles.questionBox}>
            <ThemedText style={styles.questionText}>{question}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.answerContainer}>
          <ThemedText style={styles.sectionTitle}>回答</ThemedText>
          <ThemedView style={styles.answerBox}>
            {isLoading ? (
              <ThemedText style={styles.loadingText}>
                回答を生成中...
              </ThemedText>
            ) : currentAnswer ? (
              <ThemedText style={styles.answerText}>{currentAnswer}</ThemedText>
            ) : (
              <ThemedText style={styles.errorText}>
                回答の取得に失敗しました
              </ThemedText>
            )}
          </ThemedView>
        </ThemedView>

        {currentAnswer && !isLoading && (
          <ThemedView style={styles.speechContainer}>
            <Pressable
              style={[
                styles.speechButton,
                isSpeaking && styles.speechButtonActive,
              ]}
              onPress={onSpeech}
            >
              <Text style={styles.speechButtonText}>
                {isSpeaking ? '🔊 停止' : '🔊 音声で聞く'}
              </Text>
            </Pressable>
          </ThemedView>
        )}
      </ScrollView>

      <SafeAreaView>
        <ThemedView style={styles.buttonContainer}>
          <Pressable style={styles.backButton} onPress={onGoBack}>
            <Text style={styles.backButtonText}>メイン画面に戻る</Text>
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  )
}

const ResultContainer: React.FC<Props> = (props) => {
  const navigation = useNavigation<StackNavigationProp<{ index: undefined }>>()

  const { question, answer, isNew } = useLocalSearchParams<{
    question: string
    answer?: string
    timestamp?: string
    isNew?: string
  }>()
  const { response, status, fetchResponse } = useAssistant()

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState('')

  const isNewQuestion = useMemo(() => isNew === 'true', [isNew])
  const isLoading = useMemo(() => status === 'loading', [status])

  const fetchAnswer = useCallback(
    (question: string) => {
      try {
        fetchResponse(question)
      } catch {
        console.warn('Failed to fetch response')
      }
    },
    [fetchResponse],
  )

  useEffect(() => {
    if (status === 'success' && !!response) {
      setCurrentAnswer(response)
    }
  }, [response, status])

  useEffect(() => {
    if (isNewQuestion) {
      fetchAnswer(question)
    } else if (answer) {
      setCurrentAnswer(answer)
    }
  }, [isNewQuestion, answer, fetchAnswer, question])

  const onSpeech = useCallback(async () => {
    if (!currentAnswer) {
      return
    }

    if (isSpeaking) {
      Speech.stop()
      setIsSpeaking(false)
    } else {
      setIsSpeaking(true)
      Speech.speak(currentAnswer, {
        language: 'ja-JP',
        onDone: () => setIsSpeaking(false),
        onError: () => {
          setIsSpeaking(false)
          Alert.alert('エラー', '音声再生に失敗しました')
        },
      })
    }
  }, [currentAnswer, isSpeaking])

  const onGoBack = useCallback(async () => {
    if (isSpeaking) {
      Speech.stop()
    }

    if (isNewQuestion && currentAnswer && question) {
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        question,
        answer: currentAnswer,
        timestamp: Date.now(),
      }

      try {
        await addHistoryItem(historyItem)
      } catch {
        console.error('Failed to save history')
      }
    }

    navigation.popToTop()
  }, [isSpeaking, isNewQuestion, currentAnswer, question, navigation])

  return (
    <ResultComponent
      {...props}
      {...{
        question,
        currentAnswer,
        isLoading,
        isSpeaking,
        onSpeech,
        onGoBack,
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  questionContainer: {
    marginBottom: 24,
  },
  answerContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  questionBox: {
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  answerBox: {
    padding: 16,
    backgroundColor: '#f8fff0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    minHeight: 100,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  speechContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  speechButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 150,
  },
  speechButtonActive: {
    backgroundColor: '#FF9500',
  },
  speechButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default ResultContainer
