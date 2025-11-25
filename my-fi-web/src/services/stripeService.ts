const API_URL = 'http://localhost:3000';

export const stripeService = {
    createSession: async () => {
        const response = await fetch(`${API_URL}/financial-connections-sheet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    },

    fetchAccounts: async (sessionId: string) => {
        const response = await fetch(`${API_URL}/accounts?session_id=${sessionId}`);
        return await response.json();
    },

    fetchTransactions: async (accountId: string) => {
        const response = await fetch(`${API_URL}/transactions?account_id=${accountId}`);
        return await response.json();
    }
};
