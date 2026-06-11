import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';
import { colors } from '@autoparts/ui-core';

const fontConfig = {
  fontFamily: 'Inter-Regular',
};

const customFonts = configureFonts({
  config: fontConfig,
});

// Override all variants to use Inter
Object.keys(customFonts).forEach((variant) => {
  (customFonts as any)[variant].fontFamily = 'Inter-Regular';
});

export const theme = {
  ...DefaultTheme,
  fonts: customFonts,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.danger,
    background: colors.background,
    surface: colors.surface,
    onSurface: colors.text,
    outline: colors.border,
  },
};
