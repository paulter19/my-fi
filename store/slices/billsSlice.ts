import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Bill {
    id: string;
    title: string;
    amount: number;
    dueDate: string; // For one-time: ISO date string; for monthly: day of month as string
    category: string;
    isPaid: boolean;
    type: 'monthly' | 'one-time'; // Bill recurrence type
}

interface BillsState {
    items: Bill[];
}

const initialState: BillsState = {
    items: [],
};

const billsSlice = createSlice({
    name: 'bills',
    initialState,
    reducers: {
        addBill: (state, action: PayloadAction<Bill>) => {
            state.items.push(action.payload);
        },
        updateBill: (state, action: PayloadAction<Bill>) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        // Reset all bills to initial state
        resetBills: (state) => {
            state.items = [];
        },
        setBills: (state, action: PayloadAction<Bill[]>) => {
            state.items = action.payload;
        },
        deleteBill: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        toggleBillPaid: (state, action: PayloadAction<string>) => {
            const bill = state.items.find((item) => item.id === action.payload);
            if (bill) {
                bill.isPaid = !bill.isPaid;
            }
        },
        setBillsStatus: (state, action: PayloadAction<{ ids: string[]; isPaid: boolean }>) => {
            const { ids, isPaid } = action.payload;
            state.items.forEach(bill => {
                if (ids.includes(bill.id)) {
                    bill.isPaid = isPaid;
                }
            });
        },
    },
});

export const { addBill, updateBill, resetBills, deleteBill, toggleBillPaid, setBillsStatus, setBills } = billsSlice.actions;
export default billsSlice.reducer;
