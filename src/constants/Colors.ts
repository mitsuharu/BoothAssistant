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
  },
}

const darkColor: ColorType = {
  ...defaultColor,
  TEXT: {
    PRIMARY: 'white',
    SECONDARY: '#E2E8F1',
    EMPHASIZE: '#050505',
  },
  BACKGROUND: {
    PRIMARY: '#171F2A',
    SECONDARY: '#11161D',
    EMPHASIZE: '#007AFF',
  },
}

export const COLOR = (colorScheme: ColorSchemeName = 'light') => {
  return colorScheme === 'dark' ? darkColor : defaultColor
}
