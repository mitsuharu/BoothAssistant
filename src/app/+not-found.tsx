import { styleType } from '@mitsuharu/react-native-components-plus'
import { Link, Stack } from 'expo-router'
import {
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text>This screen does not exist.</Text>
        <Link href='/' style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: styleType<ViewStyle>({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  }),
  link: styleType<TextStyle>({
    marginTop: 15,
    paddingVertical: 15,
  }),
})
