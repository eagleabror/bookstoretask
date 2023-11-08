import { createSlice } from "@reduxjs/toolkit/dist";

const initialState = {
    isLoading: false,
    loggedIn: false,
    data: [],
    addData: [],
    addStart: false,
    addDataFailur: null, 
    dataFailur: false,
    error: null,
    
    // localStorage
}

export const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        startGetData: (state) => {
            state.isLoading = true
            state.loggedIn = true
            state.addStart = false
        },
        getDataSucces: (state, action) => {
            state.isLoading = false
            state.loggedIn = true
            state.addStart = false
            state.dataFailur = false
            state.data = action.payload
            // setItem('token', action.payload.token)
            // localStorage.setItem('Key', action.payload.key)
            // localStorage.setItem('Sign', action.payload.secret)
        },
        addDataStart: (state) => {
            state.addStart = true
        },
        addDataSucces: (state, action) => {
            state.isLoading = false
            state.loggedIn = true
            state.dataFailur = false
            state.addStart = false
            state.addData = action.payload
        },
        addDataFailur: (state, action) => {
            state.isLoading = false
            state.loggedIn = true
            state.dataFailur = false
            state.addStart = false
            state.addDataFailur = action.payload
        },
        getDataFailure: (state, action) => {
            state.isLoading = false
            state.dataFailur = true
            state.error = action.payload
        }
    }
}) 

export const { startGetData, getDataSucces, getDataFailure, addDataStart, addDataSucces, addDataFailur  } = bookSlice.actions
export default bookSlice.reducer