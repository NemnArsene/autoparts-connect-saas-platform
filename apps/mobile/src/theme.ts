import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { colors } from '@autoparts/ui-core';

export const theme = {
  ...DefaultTheme,
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
