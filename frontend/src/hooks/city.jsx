import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setCurrentCity, setCurrentState, setCurrentAddress } from '../redux/userSlice'
import { setLocation, setFullAddress } from '../redux/mapSlice'

export const useCurrentCity = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector((state) => state.user)
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async(position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            dispatch(setLocation({lat: latitude, lon: longitude}))
            const apiKey = import.meta.env.VITE_GEO_API_KEY

            const location = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`)
            dispatch(setCurrentCity (location?.data?.features[0]?.properties?.city))
            dispatch(setCurrentState (location?.data?.features[0]?.properties?.state))
            dispatch(setCurrentAddress (location?.data?.features[0]?.properties?.address_line2))
            dispatch(setFullAddress(location?.data?.features[0]?.properties?.formatted))
        })
    },[userData])
}