import { configureStore } from '@reduxjs/toolkit';
import billsReducer from './slices/billsSlice';
import incomeReducer from './slices/incomeSlice';
import transactionsReducer from './slices/transactionsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        income: incomeReducer,
        bills: billsReducer,
        transactions: transactionsReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
