import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    date: string; // ISO date string
    category: string;
    type: 'income' | 'expense';
    accountId?: string;
}

interface TransactionsState {
    items: Transaction[];
}

const initialState: TransactionsState = {
    items: [
        { id: '1', title: 'Grocery Shopping', amount: 150, date: '2023-11-02', category: 'Food', type: 'expense', accountId: '1' },
        { id: '2', title: 'Gas Station', amount: 45, date: '2023-11-05', category: 'Transport', type: 'expense', accountId: '1' },
        { id: '3', title: 'Salary Deposit', amount: 2500, date: '2023-11-15', category: 'Salary', type: 'income', accountId: '1' },
        { id: '4', title: 'Coffee Shop', amount: 5.50, date: '2023-11-16', category: 'Food', type: 'expense', accountId: '1' },
        { id: '5', title: 'Online Course', amount: 29.99, date: '2023-11-18', category: 'Education', type: 'expense', accountId: '3' },
    ],
};

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        addTransaction: (state, action: PayloadAction<Transaction>) => {
            state.items.push(action.payload);
        },
        updateTransaction: (state, action: PayloadAction<Transaction>) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        resetTransactions: (state) => {
            state.items = initialState.items;
        },
        deleteTransaction: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const { addTransaction, updateTransaction, resetTransactions, deleteTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
