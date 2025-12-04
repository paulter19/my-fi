import { Platform } from 'react-native';

// Use localhost for iOS simulator, 10.0.2.2 for Android emulator
const API_URL = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

export const stripeService = {
    createSession: async () => {
        // const response = await fetch(`${API_URL}/financial-connections-sheet`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // });
        // return await response.json();
        return {};
    },

    fetchAccounts: async (sessionId: string) => {
        // const response = await fetch(`${API_URL}/accounts?session_id=${sessionId}`);
        // return await response.json();
        return [];
    },

    fetchTransactions: async (accountId: string) => {
        // const response = await fetch(`${API_URL}/transactions?account_id=${accountId}`);
        // return await response.json();
        return [];
    }
};
