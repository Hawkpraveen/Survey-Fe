import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    currentUser:null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser(state, action) {
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
            toast.success("Logged in successfully")
        },
        clearCurrentUser(state,action){
            state.currentUser = null;
            state.error = null;
            state.loading = false;
            sessionStorage.removeItem("authToken");
            toast.success("Logged out successfully")
        },
        setError(state, action) {
            state.error = action.payload;
            state.currentUser = null;
            state.loading = false;
        },
        setLoading(state, action) {
            state.loading = action.payload;
            state.currentUser = null;
            state.error = null;
        },
    },
});

export const { setCurrentUser,clearCurrentUser, setError, setLoading } = userSlice.actions;

export default userSlice.reducer;