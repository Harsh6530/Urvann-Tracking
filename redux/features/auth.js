import { createSlice } from "@reduxjs/toolkit";

// Initial state for authentication
const initialState = {
    userToken: ((typeof window !== 'undefined') && localStorage.getItem('userToken')) ? localStorage.getItem('userToken') : null,
    isAuthenticated: ((typeof window !== 'undefined') && localStorage.getItem('userToken')) ? true : false,
    error: null
};

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.userToken = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;

            // Save token to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('userToken', action.payload.token);
            }
        },
        loginFailure: (state, action) => {
            state.error = action.payload.error;
            state.isAuthenticated = false;
            state.userToken = null;

            // Remove token from localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userToken');
            }
        },
        logout: (state) => {
            state.userToken = null;
            state.isAuthenticated = false;
            state.error = null;

            // Remove token from localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userToken');
            }
        },
        checkAuth: (state) => {
            // Check if the token exists in localStorage for re-authentication
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('userToken');
                state.isAuthenticated = !!token;
                state.userToken = token;
            }
        }
    }
});

// Export actions
export const { loginSuccess, loginFailure, logout, checkAuth } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
