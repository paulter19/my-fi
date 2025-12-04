import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    uid: string;
    email: string | null;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isLoading = false;
        },
    },
});

export const { setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
