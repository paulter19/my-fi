import { Transaction } from '@/store/slices/transactionsSlice';
import { nanoid } from '@reduxjs/toolkit';

export const mockStripeService = {
    fetchAccountData: async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const randomBalance = Math.floor(Math.random() * 5000) + 500;

        return {
            balance: randomBalance,
            transactions: generateMockTransactions(5),
        };
    }
};

const generateMockTransactions = (count: number): Omit<Transaction, 'accountId'>[] => {
    const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities'];
    const types: ('income' | 'expense')[] = ['expense', 'expense', 'expense', 'income', 'expense'];

    return Array.from({ length: count }).map(() => {
        const isIncome = Math.random() > 0.8;
        const amount = isIncome ? Math.floor(Math.random() * 1000) + 1000 : Math.floor(Math.random() * 100) + 5;

        return {
            id: nanoid(),
            title: isIncome ? 'Direct Deposit' : `Merchant ${Math.floor(Math.random() * 100)}`,
            amount,
            date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0],
            category: categories[Math.floor(Math.random() * categories.length)],
            type: isIncome ? 'income' : 'expense',
        };
    });
};
