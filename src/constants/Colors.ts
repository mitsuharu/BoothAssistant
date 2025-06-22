import type { ColorSchemeName } from 'react-native'

type ColorType = {
  CLEAR: string
  TEXT: {
    PRIMARY: string
    SECONDARY: string
    EMPHASIZE: string
  }
  BACKGROUND: {
    PRIMARY: string
    SECONDARY: string
    EMPHASIZE: string
    INPUT: string
    HELP: string
    QUESTION: string
    ANSWER: string
    DESTRUCTIVE: string
  }
  BORDER: {
    PRIMARY: string
    DESTRUCTIVE: string
    QUESTION: string
    ANSWER: string
  }
  FUNCTIONAL: {
    SUCCESS: string
    WARNING: string
    ERROR: string
    DISABLED: string
  }
}

const defaultColor: ColorType = {
  CLEAR: 'rgba(0,0,0,0)',
  TEXT: {
    PRIMARY: 'black',
    SECONDARY: '#4F5A6B',
    EMPHASIZE: '#ffffff',
  },
  BACKGROUND: {
    PRIMARY: '#FFFFFF',
    SECONDARY: '#F2F2F2',
    EMPHASIZE: '#007AFF',
    INPUT: '#fafafa',
    HELP: '#f0f8ff',
    QUESTION: '#f0f8ff',
    ANSWER: '#f8fff0',
    DESTRUCTIVE: '#fdf2f2',
  },
  BORDER: {
    PRIMARY: '#e0e0e0',
    DESTRUCTIVE: '#fecaca',
    QUESTION: '#007AFF',
    ANSWER: '#4CAF50',
  },
  FUNCTIONAL: {
    SUCCESS: '#4CAF50',
    WARNING: '#FF9500',
    ERROR: '#FF3B30',
    DISABLED: '#ccc',
  },
}

const darkColor: ColorType = {
  ...defaultColor,
  TEXT: {
    PRIMARY: 'white',
    SECONDARY: '#E2E8F1',
    EMPHASIZE: '#ffffff',
  },
  BACKGROUND: {
    PRIMARY: '#171F2A',
    SECONDARY: '#11161D',
    EMPHASIZE: '#007AFF',
    INPUT: '#1f2937',
    HELP: '#1e3a8a',
    QUESTION: '#1e3a8a',
    ANSWER: '#166534',
    DESTRUCTIVE: '#7f1d1d',
  },
  BORDER: {
    PRIMARY: '#374151',
    DESTRUCTIVE: '#991b1b',
    QUESTION: '#007AFF',
    ANSWER: '#4CAF50',
  },
  FUNCTIONAL: {
    SUCCESS: '#4CAF50',
    WARNING: '#FF9500',
    ERROR: '#FF3B30',
    DISABLED: '#555',
  },
}

export const COLOR = (colorScheme: ColorSchemeName = 'light') => {
  return colorScheme === 'dark' ? darkColor : defaultColor
}
