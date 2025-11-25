import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from '../store/store';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { StripeProvider } from '@stripe/stripe-react-native';

function RootLayoutNav() {
  const theme = useSelector((state: RootState) => state.ui.theme);

  return (
    <StripeProvider publishableKey="pk_test_51SXUzZPJNIokrXB6bIVrLwutXqrlQTFLGQndCHpULqCnhz03QFCcYC7fpyiq14Bib1EOrzOr9RvbYrQ5KFjhDxNP00e4DSisf4">
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </StripeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
