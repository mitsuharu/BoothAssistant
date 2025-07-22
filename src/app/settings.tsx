import { Button, styleType } from '@mitsuharu/react-native-components-plus'
import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  type TextStyle,
  useColorScheme,
  View,
  type ViewStyle,
} from 'react-native'
import { makeStyles } from 'react-native-swag-styles'
import { COLOR } from '@/constants/Colors'
import { clearAllHistory } from '@/utils/storage'

type SettingsComponentProps = {
  isDeleting: boolean
  onClearAllHistory: () => void
}

type Props = SettingsComponentProps & {}

const SettingsComponent: React.FC<SettingsComponentProps> = ({
  isDeleting,
  onClearAllHistory,
}) => {
  const styles = useStyles()
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>データ管理</Text>

          <Button
            style={[styles.destructiveItem, isDeleting && styles.disabledItem]}
            onPress={onClearAllHistory}
            inactive={isDeleting}
          >
            <View style={styles.settingItemContent}>
              <Text style={styles.destructiveText}>
                {isDeleting ? '削除中...' : 'すべての履歴を削除'}
              </Text>
              <Text style={styles.settingItemDescription}>
                保存されているすべての質問と回答を削除します
              </Text>
            </View>
          </Button>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリについて</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemTitle}>BoothAssistant</Text>
              <Text style={styles.settingItemDescription}>
                バージョン 1.0.0
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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

const useStyles = makeStyles(useColorScheme, (colorScheme) => {
  const styles = StyleSheet.create({
    container: styleType<ViewStyle>({
      flex: 1,
      backgroundColor: COLOR(colorScheme).BACKGROUND.SECONDARY,
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
      color: COLOR(colorScheme).TEXT.PRIMARY,
    }),
    settingItem: styleType<ViewStyle>({
      backgroundColor: COLOR(colorScheme).BACKGROUND.PRIMARY,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: COLOR(colorScheme).BORDER.PRIMARY,
    }),
    destructiveItem: styleType<ViewStyle>({
      backgroundColor: COLOR(colorScheme).BACKGROUND.DESTRUCTIVE,
      borderColor: COLOR(colorScheme).BORDER.DESTRUCTIVE,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
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
      color: COLOR(colorScheme).TEXT.PRIMARY,
    }),
    settingItemDescription: styleType<TextStyle>({
      fontSize: 14,
      opacity: 0.7,
      color: COLOR(colorScheme).TEXT.SECONDARY,
    }),
    destructiveText: styleType<TextStyle>({
      fontSize: 16,
      fontWeight: '500',
      color: COLOR(colorScheme).FUNCTIONAL.ERROR,
      marginBottom: 4,
    }),
  })
  return styles
})

export default SettingsContainer
