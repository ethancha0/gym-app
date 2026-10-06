import { DarkTheme, type NativeStackNavigationOptions, type Theme } from 'expo-router';

import { colors } from './tokens';

// Native headers and tab bars don't read Tailwind classes; they take plain
// color values. This theme feeds our tokens into React Navigation.
export const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.separator,
  },
};

// Shared options for each tab's root screen: an iOS large title
// ("Today", "Routines") that collapses into the nav bar on scroll.
//
// Colors come from `navTheme` above (text → title, card → header background,
// primary → back button / header buttons). Don't also set headerStyle,
// headerTintColor or header*TitleStyle here: on iOS 26 setting those hid the
// large title entirely.
export const largeTitleOptions = {
  headerLargeTitleEnabled: true,
  headerShadowVisible: false,
  headerLargeTitleShadowVisible: false,
} as const;

// Options for screens presented as an iOS bottom sheet (e.g. the
// natural-language log sheet in Milestone 8). The sheet is a real route
// shown by UIKit's sheet presentation, so it gets the native grabber,
// swipe-to-dismiss, and half/full height snapping for free.
export const sheetOptions: NativeStackNavigationOptions = {
  presentation: 'formSheet',
  headerShown: false,
  sheetAllowedDetents: [0.5, 1],
  sheetGrabberVisible: true,
  sheetCornerRadius: 14,
  contentStyle: { backgroundColor: colors.surface },
};
