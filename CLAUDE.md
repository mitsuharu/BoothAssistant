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
1. **Main Screen** (`src/app/index.tsx`) - Question history display with delete functionality
2. **Input Screen** (`src/app/input.tsx`) - Question input with voice support
3. **Result Screen** (`src/app/result.tsx`) - AI responses with text-to-speech and inline controls
4. **Settings Screen** (`src/app/settings.tsx`) - Data management and bulk delete operations

### Directory Structure
- `src/app/` - Expo Router pages with file-based routing
  - `index.tsx`, `input.tsx`, `result.tsx`, `settings.tsx` - Core Q&A workflow screens
  - `_layout.tsx` - Stack navigation setup with dark mode support
- `src/components/` - Reusable UI components (Button)
- `src/constants/Colors.ts` - Centralized dark/light mode color system
- `src/hooks/` - Custom React hooks (useAssistant for OpenAI integration)
- `src/types/` - TypeScript type definitions (HistoryItem interface)
- `src/utils/` - Utility functions (AsyncStorage operations, style typing)

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
- **FlashList**: High-performance history list rendering with delete actions
- **Container Component Pattern**: Separation of logic (Container) and presentation (Component)
- **Dark Mode Support**: Dynamic styling using `makeStyles` with `react-native-swag-styles`
- **Stack Navigation**: Expo Router with themed headers and iOS-style transitions
- **Speech Controls**: Inline audio controls in result headers

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
- **react-native-swag-styles** - Dynamic styling with theme support

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
1. Create screen file in `src/app/` following Container Component pattern
2. Add Stack.Screen to `_layout.tsx` with appropriate theming
3. Use Expo Router's `useRouter()` for navigation
4. Implement dark mode styling with `makeStyles` and `COLOR(colorScheme)`
5. Follow existing naming conventions (Japanese UI text)

### Managing State
- Use AsyncStorage for persistence with utility functions
- Implement loading states for async operations
- Handle errors with user-friendly Japanese messages
- Use `useFocusEffect` for screen refresh synchronization
- Use TypeScript interfaces for all data structures

## Styling and Theming

### Dark Mode Implementation
- Uses `COLOR(colorScheme)` function from `src/constants/Colors.ts`
- Dynamic styling with `makeStyles(() => useColorScheme(), (colorScheme) => {})`
- Comprehensive color system: `TEXT`, `BACKGROUND`, `BORDER`, `FUNCTIONAL`
- Both light and dark variants for all UI elements

### Container Component Pattern
All screens follow the pattern:
```tsx
// Presentation Component
const ScreenComponent: React.FC<Props> = ({ ... }) => {
  const styles = useStyles()
  // UI rendering only
}

// Logic Container
const ScreenContainer: React.FC<Props> = (props) => {
  // State management and business logic
  return <ScreenComponent {...props} {...logic} />
}

// Dynamic Styles
const useStyles = makeStyles(() => useColorScheme(), (colorScheme) => {
  return StyleSheet.create({
    // Theme-aware styles using COLOR(colorScheme)
  })
})
```

### Type Safety
- Uses `styleType<ViewStyle>()` and `styleType<TextStyle>()` for enhanced type safety
- Centralized Button component replacing all Pressable instances
- TypeScript interfaces for all data structures

## Data Management

### History Operations
- Individual item deletion with long-press or delete button
- Bulk deletion through settings screen
- Automatic synchronization between screens using `useFocusEffect`
- AsyncStorage utilities: `loadHistory()`, `addHistoryItem()`, `removeHistoryItem()`, `clearAllHistory()`

## Important Implementation Notes

### Error Handling Patterns
- Catch blocks should provide meaningful Japanese error messages to users
- Log errors to console for debugging but avoid exposing technical details
- Use `Alert.alert()` for user-facing error notifications

### Navigation Flow
- Main entry: `/index` → `/input` → `/result` → back to `/index`
- Settings accessible via header button: `/index` → `/settings` (modal)
- Result screen automatically saves to history when returning from new questions
- Use `router.push()` for forward navigation, `router.back()` or `router.replace()` for returns
- Data synchronization using `useFocusEffect` to refresh screens after operations

### Testing the App
- Requires valid OpenAI API key in `.env.local` for full functionality
- Voice input relies on device keyboard's built-in speech recognition
- Speech output requires device audio capabilities
- Test dark mode switching to ensure immediate color updates
- Test data synchronization between screens (especially after deletions)