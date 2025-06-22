import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/Button'
import { styleType } from '@/utils/styles'

type InputComponentProps = {
  inputText: string
  onInputTextChange: (text: string) => void
  onQuestionSubmit: () => void
  onCancel: () => void
}

type Props = InputComponentProps & {}

const InputComponent: React.FC<InputComponentProps> = ({
  inputText,
  onInputTextChange,
  onQuestionSubmit,
  onCancel,
}) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>知りたいことを入力してください</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={onInputTextChange}
              placeholder='ここに質問を入力してください...'
              placeholderTextColor='#999'
              multiline
              numberOfLines={8}
              textAlignVertical='top'
            />
          </View>

          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              💡
              音声入力を使用するには、キーボードの音声入力ボタンを利用してください
            </Text>
          </View>
        </ScrollView>

        <SafeAreaView>
          <View style={styles.buttonContainer}>
            <Button
              style={[
                styles.submitButton,
                !inputText.trim() && styles.submitButtonDisabled,
              ]}
              onPress={onQuestionSubmit}
              inactive={!inputText.trim()}
              text='質問する'
              textStyle={styles.submitButtonText}
            />

            <Button
              style={styles.cancelButton}
              onPress={onCancel}
              text='キャンセル'
              textStyle={styles.cancelButtonText}
            />
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  )
}

const InputContainer: React.FC<Props> = (props) => {
  const router = useRouter()
  const [inputText, setInputText] = useState('')

  const onInputTextChange = useCallback((text: string) => {
    setInputText(text)
  }, [])

  const onQuestionSubmit = useCallback(async () => {
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

  const onCancel = useCallback(() => {
    router.back()
  }, [router])

  return (
    <InputComponent
      {...props}
      {...{
        inputText,
        onInputTextChange,
        onQuestionSubmit,
        onCancel,
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: styleType<ViewStyle>({
    flex: 1,
  }),
  content: styleType<ViewStyle>({
    flex: 1,
    padding: 16,
  }),
  scrollView: styleType<ViewStyle>({
    flex: 1,
  }),
  header: styleType<ViewStyle>({
    marginBottom: 24,
  }),
  subtitle: styleType<TextStyle>({
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
  }),
  inputContainer: styleType<ViewStyle>({
    marginBottom: 16,
  }),
  textInput: styleType<TextStyle>({
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    backgroundColor: '#fafafa',
  }),
  helpContainer: styleType<ViewStyle>({
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 16,
  }),
  helpText: styleType<TextStyle>({
    fontSize: 14,
    color: '#0066cc',
  }),
  buttonContainer: styleType<ViewStyle>({
    paddingTop: 16,
    gap: 12,
  }),
  submitButton: styleType<ViewStyle>({
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  }),
  submitButtonDisabled: styleType<ViewStyle>({
    backgroundColor: '#ccc',
  }),
  submitButtonText: styleType<TextStyle>({
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }),
  cancelButton: styleType<ViewStyle>({
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  }),
  cancelButtonText: styleType<TextStyle>({
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  }),
})

export default InputContainer
