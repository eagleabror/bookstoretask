import { createSlice } from "@reduxjs/toolkit/dist";

const initialState = {
    isLoading: false,
    loggedIn: false,
    loginUserFailur: false,
    error: null,
    user: [],
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signUserStart: (state) => {
            state.isLoading = true
            state.loginUserFailur = false
        },
        signUserSuccess: (state, action) => {
            state.isLoading = false
            state.loggedIn = true
            state.loginUserFailur = false
            state.user = action.payload
            localStorage.setItem('Key', action.payload.key)
            localStorage.setItem('Sign', action.payload.secret)
        },
        signUserFailure: (state, action) => {
            state.isLoading = false
            state.loginUserFailur = true
            state.error = action.payload
        }
    }
})

export const { signUserStart, signUserSuccess, signUserFailure } = authSlice.actions
export default authSlice.reducer