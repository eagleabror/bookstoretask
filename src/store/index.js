import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from '../slice/auth'
import bookSlice  from '../slice/book'

export default configureStore({
  reducer: {
    auth: AuthSlice,
    books: bookSlice
  },
  devTools: process.env.NODE_ENV !== 'production',
})