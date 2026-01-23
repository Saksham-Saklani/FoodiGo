import { createSlice }  from "@reduxjs/toolkit";

const mapSlice = createSlice({
    name:'map',
    initialState:{
        location:{
            lat:0,
            lon:0
        },
        fullAddress: null
    },
    reducers:{
        setLocation: (state, action) => {
            const {lat, lon} = action.payload
            state.location.lat = lat
            state.location.lon = lon
        },
        setFullAddress: (state, action) => {
            state.fullAddress = action.payload
        }
    }
})

export const { setLocation, setFullAddress } = mapSlice.actions
export default mapSlice.reducer