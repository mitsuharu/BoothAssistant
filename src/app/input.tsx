import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

export default function InputScreen() {
  const router = useRouter()
  const [inputText, setInputText] = useState('')

  const handleQuestionSubmit = useCallback(async () => {
    if (!inputText.trim()) {
      Alert.alert('エラー', '質問を入力してください')
      return
    }

    try {
      router.push({
        pathname: '/result',
        params: {
          question: inputText.trim(),
          isNew: 'true',
        },
      })
    } catch {
      Alert.alert('エラー', '質問の処理に失敗しました')
    }
  }, [inputText, router])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.content}>
        <ScrollView style={styles.scrollView}>
          <ThemedView style={styles.header}>
            <ThemedText type='title'>質問を入力</ThemedText>
            <ThemedText style={styles.subtitle}>
              知りたいことを入力してください
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder='ここに質問を入力してください...'
              placeholderTextColor='#999'
              multiline
              numberOfLines={8}
              textAlignVertical='top'
            />
          </ThemedView>

          <ThemedView style={styles.helpContainer}>
            <ThemedText style={styles.helpText}>
              💡
              音声入力を使用するには、キーボードの音声入力ボタンを利用してください
            </ThemedText>
          </ThemedView>
        </ScrollView>

        <ThemedView style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.submitButton,
              !inputText.trim() && styles.submitButtonDisabled,
            ]}
            onPress={handleQuestionSubmit}
            disabled={!inputText.trim()}
          >
            <Text style={styles.submitButtonText}>{'質問する'}</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>キャンセル</Text>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    backgroundColor: '#fafafa',
  },
  helpContainer: {
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#0066cc',
  },
  buttonContainer: {
    paddingTop: 16,
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
