import { createSlice  } from '@reduxjs/toolkit'

const ownerSlice = createSlice({
    name: 'owner',
    initialState:{
        restaurantData: null,
        itemData: null
    },
    reducers:{
        setRestaurantData: (state, action) => {
            state.restaurantData = action.payload
        }
    }
})

export const { setRestaurantData } = ownerSlice.actions
export default ownerSlice.reducer