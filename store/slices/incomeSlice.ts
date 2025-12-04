import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Income {
  id: string;
  title: string;
  amount: number;
  frequency: 'monthly' | 'one-time';
}

interface IncomeState {
  items: Income[];
}

const initialState: IncomeState = {
  items: [],
};

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    addIncome: (state, action: PayloadAction<Income>) => {
      state.items.push(action.payload);
    },
    updateIncome: (state, action: PayloadAction<Income>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    // Reset all income to initial state
    resetIncome: (state) => {
      state.items = [];
    },
    setIncome: (state, action: PayloadAction<Income[]>) => {
      state.items = action.payload;
    },
    deleteIncome: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addIncome, updateIncome, resetIncome, deleteIncome, setIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
