# CLAUDE.md

必ず日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BoothAssistant is a React Native Expo application that provides a Q&A interface with AI-powered responses. The app integrates with OpenAI's API using MCP (Model Context Protocol) and features a three-screen workflow: main screen (history), input screen (questions), and result screen (answers with speech).

## Development Commands

### Setup
```bash
# Install dependencies
yarn install

# Environment setup - create .env.local with:
# OPENAI_API_KEY=sk-...
```

### Development
```bash
# Start development server
npx expo start

# Platform-specific development
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

### Code Quality
```bash
# Lint and format code (uses Biome)
npm run lint

# Manual Biome commands
npx @biomejs/biome check --write ./src
npx @biomejs/biome format --write ./src
```

### Project Reset
```bash
# Reset to blank template (moves current app to app-example)
npm run reset-project
```

## App Architecture

### Core Application Flow
1. **Home Screen** (`src/app/(tabs)/index.tsx`) - Entry point with navigation to main app
2. **Main Screen** (`src/app/main.tsx`) - Question history display and input navigation
3. **Input Screen** (`src/app/input.tsx`) - Question input with voice support
4. **Result Screen** (`src/app/result.tsx`) - AI responses with text-to-speech

### Directory Structure
- `src/app/` - Expo Router pages with file-based routing
  - `(tabs)/` - Original tab navigation (index.tsx, explore.tsx)
  - `main.tsx`, `input.tsx`, `result.tsx` - Core Q&A workflow screens
  - `_layout.tsx` - Stack navigation setup for all screens
- `src/components/` - Reusable themed UI components
- `src/hooks/` - Custom React hooks (useAssistant for OpenAI integration)
- `src/types/` - TypeScript type definitions (HistoryItem interface)
- `src/utils/` - Utility functions (AsyncStorage operations)

### Key Technical Implementation

#### Question & Answer Flow
- **Input Processing**: Text input with keyboard voice input support
- **AI Integration**: OpenAI Responses API with MCP server integration
- **History Management**: AsyncStorage for persistent question/answer history
- **Speech Output**: Expo Speech for text-to-speech functionality

#### Data Persistence
- Uses `@react-native-async-storage/async-storage` for history storage
- History items contain: `id`, `question`, `answer`, `timestamp`
- Storage utilities in `src/utils/storage.ts` handle CRUD operations

#### OpenAI Integration (`src/hooks/useAssistant.ts`)
- Uses OpenAI Responses API with `gpt-4.1` model
- MCP integration with custom server (`yumemi-openhandbook`) for enhanced context
- Client initialization within callback to prevent React dependency issues
- Status tracking: `idle`, `loading`, `success`, `error`
- API key accessed via `Constants.expoConfig?.extra?.OPENAI_API_KEY`

#### UI Components & Navigation
- **FlashList**: High-performance history list rendering
- **Themed Components**: `ThemedText`, `ThemedView` with color scheme support
- **Stack Navigation**: Expo Router with screen-specific headers
- **Speech Controls**: Play/pause buttons with visual feedback

#### Code Style (Biome)
- Single quotes for JavaScript/JSX
- Space indentation, semicolons only when needed
- Auto-organize imports enabled
- Strict TypeScript configuration

## Environment Requirements

Required environment variables in `.env.local`:
```
OPENAI_API_KEY=sk-your-openai-api-key
```

## Key Dependencies

### Core Framework
- **Expo SDK 53** with New Architecture enabled
- **Expo Router 5** for file-based navigation
- **React Native 0.79** with React 19

### Feature-Specific
- **@shopify/flash-list** - High-performance list rendering
- **@react-native-async-storage/async-storage** - Local data persistence
- **expo-speech** - Text-to-speech functionality
- **openai** - OpenAI API integration

### Development Tools
- **@biomejs/biome** - Linting and formatting
- **TypeScript 5.8** - Type safety
- **Yarn 4.9.2** - Package manager

## Platform Support

- **iOS**: Tablet support, New Architecture, blur effects
- **Android**: Edge-to-edge UI, adaptive icons
- **Web**: Metro bundler with static output

## Common Development Patterns

### Adding New Screens
1. Create screen file in `src/app/`
2. Add Stack.Screen to `_layout.tsx`
3. Use Expo Router's `useRouter()` for navigation
4. Follow existing naming conventions (Japanese UI text)

### Managing State
- Use AsyncStorage for persistence
- Implement loading states for async operations
- Handle errors with user-friendly Japanese messages
- Use TypeScript interfaces for data structures

## Important Implementation Notes

### Error Handling Patterns
- Catch blocks should provide meaningful Japanese error messages to users
- Log errors to console for debugging but avoid exposing technical details
- Use `Alert.alert()` for user-facing error notifications

### Navigation Flow
- Main entry: `(tabs)/index.tsx` → `/main` → `/input` → `/result` → back to `/main`
- Result screen automatically saves to history when returning from new questions
- Use `router.push()` for forward navigation, `router.back()` or `router.replace()` for returns

### Testing the App
- Requires valid OpenAI API key in `.env.local` for full functionality
- Voice input relies on device keyboard's built-in speech recognition
- Speech output requires device audio capabilities