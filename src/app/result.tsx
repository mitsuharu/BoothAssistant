import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useLocalSearchParams } from 'expo-router'
import * as Speech from 'expo-speech'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/Button'
import { useAssistant } from '@/hooks/useAssistant'
import type { HistoryItem } from '@/types/history'
import { addHistoryItem } from '@/utils/storage'
import { styleType } from '@/utils/styles'

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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.questionContainer}>
          <Text style={styles.sectionTitle}>質問</Text>
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>{question}</Text>
          </View>
        </View>

        <View style={styles.answerContainer}>
          <Text style={styles.sectionTitle}>回答</Text>
          <View style={styles.answerBox}>
            {isLoading ? (
              <Text style={styles.loadingText}>回答を生成中...</Text>
            ) : currentAnswer ? (
              <Text style={styles.answerText}>{currentAnswer}</Text>
            ) : (
              <Text style={styles.errorText}>回答の取得に失敗しました</Text>
            )}
          </View>
        </View>

        {currentAnswer && !isLoading && (
          <View style={styles.speechContainer}>
            <Button
              style={[
                styles.speechButton,
                isSpeaking && styles.speechButtonActive,
              ]}
              onPress={onSpeech}
              text={isSpeaking ? '🔊 停止' : '🔊 音声で聞く'}
              textStyle={styles.speechButtonText}
            />
          </View>
        )}
      </ScrollView>

      <SafeAreaView>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.backButton}
            onPress={onGoBack}
            text='メイン画面に戻る'
            textStyle={styles.backButtonText}
          />
        </View>
      </SafeAreaView>
    </View>
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
  container: styleType<ViewStyle>({
    flex: 1,
    padding: 16,
  }),
  scrollView: styleType<ViewStyle>({
    flex: 1,
  }),
  header: styleType<ViewStyle>({
    marginBottom: 24,
  }),
  questionContainer: styleType<ViewStyle>({
    marginBottom: 24,
  }),
  answerContainer: styleType<ViewStyle>({
    marginBottom: 24,
  }),
  sectionTitle: styleType<TextStyle>({
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  }),
  questionBox: styleType<ViewStyle>({
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  }),
  questionText: styleType<TextStyle>({
    fontSize: 16,
    lineHeight: 24,
  }),
  answerBox: styleType<ViewStyle>({
    padding: 16,
    backgroundColor: '#f8fff0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    minHeight: 100,
  }),
  answerText: styleType<TextStyle>({
    fontSize: 16,
    lineHeight: 24,
  }),
  loadingText: styleType<TextStyle>({
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.7,
  }),
  errorText: styleType<TextStyle>({
    fontSize: 16,
    color: '#FF3B30',
  }),
  speechContainer: styleType<ViewStyle>({
    alignItems: 'center',
    marginBottom: 24,
  }),
  speechButton: styleType<ViewStyle>({
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 150,
  }),
  speechButtonActive: styleType<ViewStyle>({
    backgroundColor: '#FF9500',
  }),
  speechButtonText: styleType<TextStyle>({
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }),
  buttonContainer: styleType<ViewStyle>({
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  }),
  backButton: styleType<ViewStyle>({
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  }),
  backButtonText: styleType<TextStyle>({
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }),
})

export default ResultContainer
