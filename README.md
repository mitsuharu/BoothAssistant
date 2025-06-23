# BoothAssistantApp

- OpenAI API + ゆめみオープンハンドブック MCP を利用したアプリ
- カンファレンスのブースなどにおけるAIアシスタントを想定しています

https://github.com/user-attachments/assets/0b63bb2c-c2ef-487a-b1a7-6c1be8e41bac

## Get started

0. Add `.env.local` with your OpenAI API Key
	-  It does not commit `.env.local`, excludes by gitignore.
	
   ```shell
   OPENAI_API_KEY=sk-...
   ```

1. Install dependencies

   ```bash
   yarn install
   ```

2. Start the app

   ```bash
   yarn expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).
