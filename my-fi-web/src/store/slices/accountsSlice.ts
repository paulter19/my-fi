import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Account {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'credit';
    balance: number;
    currency: string;
    source: 'manual' | 'stripe';
    stripeAccountId?: string;
    lastSynced?: string;
}

interface AccountsState {
    items: Account[];
}

const initialState: AccountsState = {
    items: [],
};

const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        addAccount: (state, action: PayloadAction<Account>) => {
            state.items.push(action.payload);
        },
        updateAccount: (state, action: PayloadAction<Account>) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteAccount: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        resetAccounts: (state) => {
            state.items = initialState.items;
        }
    },
});

export const { addAccount, updateAccount, deleteAccount, resetAccounts } = accountsSlice.actions;
export default accountsSlice.reducer;
