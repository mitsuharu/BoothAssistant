# CLAUDE.md

必ず日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BoothAssistant is a React Native Expo application that integrates with OpenAI's API using the new MCP (Model Context Protocol) features. The app is built with Expo Router for file-based navigation and includes both iOS and Android support.

## Development Commands

### Setup
```bash
# Install dependencies
yarn install

# Add environment variables - create .env.local with:
# OPENAI_API_KEY=sk-...
```

### Development
```bash
# Start development server
npx expo start

# Platform-specific development
npx expo start --ios     # iOS simulator
npx expo start --android # Android emulator
npx expo start --web     # Web browser

# Or using npm scripts
npm run ios
npm run android  
npm run web
```

### Code Quality
```bash
# Lint code (uses Expo's built-in linting)
npm run lint

# Format code (uses Biome)
npx biome format --write .
npx biome check --apply .
```

### Project Reset
```bash
# Reset to blank template (moves current app to app-example)
npm run reset-project
```

## Architecture

### Directory Structure
- `src/app/` - Expo Router pages with file-based routing
  - `(tabs)/` - Tab navigation group with index.tsx (Home) and explore.tsx screens
  - `_layout.tsx` - Root layout with theme provider and navigation setup
- `src/components/` - Reusable React components
  - `ui/` - Platform-specific UI components (iOS/Android variants)
- `src/hooks/` - Custom React hooks, including `useAssistant` for OpenAI integration
- `src/constants/` - App constants like Colors theme definitions

### Key Technical Details

#### OpenAI Integration
The app uses the `useAssistant` hook (src/hooks/useAssistant.ts) which:
- Integrates with OpenAI's new Responses API (`gpt-4.1` model)
- Uses MCP (Model Context Protocol) with a custom server (`yumemi-openhandbook`)
- Requires `OPENAI_API_KEY` in environment variables
- API key is accessed via `Constants.expoConfig?.extra?.OPENAI_API_KEY`

#### Theming System
- Uses React Navigation's theme provider with automatic dark/light mode detection
- Custom themed components (`ThemedText`, `ThemedView`) that adapt to color scheme
- Theme colors defined in `src/constants/Colors.ts`
- Uses `useColorScheme` hook for theme detection

#### Navigation
- File-based routing with Expo Router
- Tab navigation with haptic feedback (`HapticTab` component)
- Platform-specific tab bar styling (transparent on iOS for blur effect)

#### Code Style (Biome Configuration)
- Uses single quotes for JavaScript/JSX
- Semicolons only when needed
- Space indentation
- Auto-organize imports enabled
- Follows recommended linting rules

## Environment Setup

The app requires an OpenAI API key to function. Create `.env.local`:
```
OPENAI_API_KEY=sk-your-api-key-here
```

## Platform Support

The app is configured for:
- iOS (supports tablets, uses New Architecture)
- Android (edge-to-edge enabled, adaptive icon)
- Web (Metro bundler, static output)

Package manager: Yarn 4.9.2