import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth"; // Adjust the import if needed to match your file structure

// Function to load the state from localStorage
function loadState() {
    try {
        const serializedState = (typeof window !== 'undefined') ? localStorage.getItem('userToken') : null;
        if (serializedState === null) {
            return { auth: { userToken: null, isAuthenticated: false, error: null } }; // Initial state for auth
        }
        return { auth: { userToken: serializedState, isAuthenticated: true, error: null } }; // If token exists, user is authenticated
    } catch (err) {
        return { auth: { userToken: null, isAuthenticated: false, error: null } }; // Fallback state
    }
}

// Function to save the state to localStorage
function saveState(state) {
    try {
        const serializedState = state.auth.userToken;
        if (typeof window !== 'undefined' && serializedState) {
            localStorage.setItem('userToken', serializedState);
        } else {
            localStorage.removeItem('userToken'); // Remove if token is null
        }
    } catch (error) {
        console.error('Failed to save state:', error);
    }
}

// Configure the Redux store
const store = configureStore({
    reducer: {
        auth: authReducer // Use the auth reducer
    },
    preloadedState: loadState() // Load initial state from localStorage
});

// Subscribe to store updates and save the state to localStorage
store.subscribe(() => {
    saveState(store.getState());
});

// Function to create the store (if needed for server-side or client-side)
export const makeStore = () => {
    return store;
};

export default store;
