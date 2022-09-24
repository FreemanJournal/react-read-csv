import { configureStore } from "@reduxjs/toolkit"
import productReducer from "../state/products.slice"
export const store = configureStore({
    reducer: {
        product: productReducer
    }
})