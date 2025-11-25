import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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
    items: [
        { id: '1', title: 'Rent', amount: 1500, dueDate: '01', category: 'Housing', isPaid: true, type: 'monthly' },
        { id: '2', title: 'Electricity', amount: 120, dueDate: '2023-11-15', category: 'Utilities', isPaid: false, type: 'one-time' },
        { id: '3', title: 'Internet', amount: 60, dueDate: '2023-11-20', category: 'Utilities', isPaid: false, type: 'one-time' },
        { id: '4', title: 'Car Insurance', amount: 100, dueDate: '2023-11-25', category: 'Insurance', isPaid: false, type: 'one-time' },
    ],
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
            state.items = initialState.items;
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

export const { addBill, updateBill, deleteBill, toggleBillPaid, setBillsStatus, resetBills } = billsSlice.actions;
export default billsSlice.reducer;
