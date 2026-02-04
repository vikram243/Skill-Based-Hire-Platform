import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../slices/userSlice.js'
import ordersReducer from '../slices/OrdersSlice.js'

export const store = configureStore({
  reducer: {
    user: userReducer,
    orders: ordersReducer,
  },
})