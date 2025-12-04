import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { StripeProvider } from '@stripe/stripe-react-native';
import { auth } from '@/firebaseConfig';
import { firebaseService } from '@/services/firebaseService';
import { resetAccounts, setAccounts } from '@/store/slices/accountsSlice';
import { setLoading, setUser } from '@/store/slices/authSlice';
import { resetBills, setBills } from '@/store/slices/billsSlice';
import { resetIncome, setIncome } from '@/store/slices/incomeSlice';
import { resetTransactions, setTransactions } from '@/store/slices/transactionsSlice';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../store/store';

export const unstable_settings = {
  anchor: '(tabs)',
};


function RootLayoutNav() {
  const theme = useSelector((state: RootState) => state.ui.theme);
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const bills = useSelector((state: RootState) => state.bills);
  const income = useSelector((state: RootState) => state.income);
  const transactions = useSelector((state: RootState) => state.transactions);
  const accounts = useSelector((state: RootState) => state.accounts);
  const dispatch = useDispatch();
  const router = useRouter();
  const segments = useSegments();

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        dispatch(setUser({ uid: currentUser.uid, email: currentUser.email }));

        // Fetch user data
        const userData = await firebaseService.fetchUserData(currentUser.uid);
        if (userData) {
          if (userData.bills && userData.bills.items) dispatch(setBills(userData.bills.items));
          if (userData.income && userData.income.items) dispatch(setIncome(userData.income.items));
          if (userData.transactions && userData.transactions.items) dispatch(setTransactions(userData.transactions.items));
          if (userData.accounts && userData.accounts.items) dispatch(setAccounts(userData.accounts.items));

          console.log('User data fetched and set in store');
        }
      } else {
        dispatch(setUser(null));
        // Clear all data on logout
        dispatch(resetBills());
        dispatch(resetIncome());
        dispatch(resetTransactions());
        dispatch(resetAccounts());
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, []);

  // Protected Route Logic
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to the login page if not signed in and not in auth group
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to the tabs page if signed in and in auth group
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  // Data Sync Logic (Auto-save)
  useEffect(() => {
    if (user?.uid) {
      const saveData = async () => {
        await firebaseService.saveUserData(user.uid, {
          bills,
          income,
          transactions,
          accounts
        });
      };
      // Debounce could be added here
      const timeoutId = setTimeout(saveData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [bills, income, transactions, accounts, user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // <StripeProvider publishableKey="pk_test_51SXUzZPJNIokrXB6bIVrLwutXqrlQTFLGQndCHpULqCnhz03QFCcYC7fpyiq14Bib1EOrzOr9RvbYrQ5KFjhDxNP00e4DSisf4">
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
    // </StripeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
