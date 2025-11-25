import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    isLoading: boolean;
    isModalOpen: boolean;
    activeModalType: 'addIncome' | 'addBill' | 'addTransaction' | null;
    theme: 'light' | 'dark';
}

const initialState: UiState = {
    isLoading: false,
    isModalOpen: false,
    activeModalType: null,
    theme: 'light',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        openModal: (state, action: PayloadAction<'addIncome' | 'addBill' | 'addTransaction'>) => {
            state.isModalOpen = true;
            state.activeModalType = action.payload;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.activeModalType = null;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
    },
});

export const { setLoading, openModal, closeModal, toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
