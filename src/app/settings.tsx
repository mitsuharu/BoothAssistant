import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { clearAllHistory } from '@/utils/storage'
import { styleType } from '@/utils/styles'

type SettingsComponentProps = {
  isDeleting: boolean
  onClearAllHistory: () => void
}

type Props = SettingsComponentProps & {}

const SettingsComponent: React.FC<SettingsComponentProps> = ({
  isDeleting,
  onClearAllHistory,
}) => {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>データ管理</ThemedText>

          <Pressable
            style={[
              styles.settingItem,
              styles.destructiveItem,
              isDeleting && styles.disabledItem,
            ]}
            onPress={onClearAllHistory}
            disabled={isDeleting}
          >
            <ThemedView style={styles.settingItemContent}>
              <ThemedText style={styles.destructiveText}>
                {isDeleting ? '削除中...' : 'すべての履歴を削除'}
              </ThemedText>
              <ThemedText style={styles.settingItemDescription}>
                保存されているすべての質問と回答を削除します
              </ThemedText>
            </ThemedView>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>アプリについて</ThemedText>

          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingItemContent}>
              <ThemedText style={styles.settingItemTitle}>
                BoothAssistant
              </ThemedText>
              <ThemedText style={styles.settingItemDescription}>
                バージョン 1.0.0
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  )
}

const SettingsContainer: React.FC<Props> = (props) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const onClearAllHistory = useCallback(async () => {
    Alert.alert(
      '確認',
      'すべての質問履歴を削除しますか？この操作は取り消せません。',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true)
            try {
              await clearAllHistory()
              Alert.alert('完了', 'すべての履歴を削除しました', [
                {
                  text: 'OK',
                  onPress: () => {
                    router.back()
                  },
                },
              ])
            } catch {
              Alert.alert('エラー', '履歴の削除に失敗しました')
            } finally {
              setIsDeleting(false)
            }
          },
        },
      ],
    )
  }, [router])

  return (
    <SettingsComponent
      {...props}
      {...{
        isDeleting,
        onClearAllHistory,
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: styleType<ViewStyle>({
    flex: 1,
  }),
  scrollView: styleType<ViewStyle>({
    flex: 1,
    padding: 16,
  }),
  section: styleType<ViewStyle>({
    marginBottom: 32,
  }),
  sectionTitle: styleType<TextStyle>({
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 4,
  }),
  settingItem: styleType<ViewStyle>({
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  }),
  destructiveItem: styleType<ViewStyle>({
    backgroundColor: '#fdf2f2',
    borderColor: '#fecaca',
  }),
  disabledItem: styleType<ViewStyle>({
    opacity: 0.5,
  }),
  settingItemContent: styleType<ViewStyle>({
    flex: 1,
    backgroundColor: 'transparent',
  }),
  settingItemTitle: styleType<TextStyle>({
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  }),
  settingItemDescription: styleType<TextStyle>({
    fontSize: 14,
    opacity: 0.7,
  }),
  destructiveText: styleType<TextStyle>({
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626',
    marginBottom: 4,
  }),
})

export default SettingsContainer
