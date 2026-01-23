import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { setMyCityRestaurants } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'

export const useMyCityRestaurants = () => {
    const dispatch = useDispatch()
    const { currentCity } = useSelector(state => state.user)
    useEffect(() => {
        const fetchMyCityRestaurants = async() => {
            try {
                const result = await axios.get(`${serverUrl}/api/restaurant/${currentCity}`,
                    {withCredentials: true}
                )
                if(result) dispatch(setMyCityRestaurants(result.data))
                    console.log(result.data)

            } catch (error) {
                console.log(error)
            }
        }
        fetchMyCityRestaurants()
    },[currentCity])

}