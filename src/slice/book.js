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
    deleteStart: false,
    deleteSucces: false,
    deleteError: null,
    deleteData: [],
    editStart: false,
    editSucces: false,
    editError: null,
    editData: [],
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
        },
        deleteDataStart : (state) => {
            state.isLoading = false
            state.deleteStart = true
        },
        deleteDataSucces : (state, action) => {
            state.isLoading = false
            state.deleteStart = false
            state.deleteSucces = true
            state.deleteData = action.payload
        },
        deleteDataError : (state, action) => {
            state.isLoading = false
            state.deleteStart = false
            state.deleteSucces = false
            state.deleteError = action.payload
        },
        editDataStart : (state) => {
            state.isLoading = false
            state.editStart = true
        },
        editDataSucces : (state, action) => {
            state.isLoading = false
            state.editStart = false
            state.editSucces = true
            state.editData = action.payload
        },
        editDataError : (state, action) => {
            state.isLoading = false
            state.editStart = false
            state.editSucces = false
            state.editError = action.payload
        }
    }
}) 

export const { startGetData, getDataSucces, getDataFailure, addDataStart, addDataSucces, addDataFailur, deleteDataStart, deleteDataSucces, deleteDataError, editDataStart, editDataSucces, editDataError  } = bookSlice.actions
export default bookSlice.reducer