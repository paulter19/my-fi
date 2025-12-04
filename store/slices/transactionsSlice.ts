import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    items: [],
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
            state.items = [];
        },
        setTransactions: (state, action: PayloadAction<Transaction[]>) => {
            state.items = action.payload;
        },
        deleteTransaction: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const { addTransaction, updateTransaction, resetTransactions, deleteTransaction, setTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
