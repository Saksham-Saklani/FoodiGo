import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { setRestaurantData } from '../redux/ownerSlice'
import { useDispatch, useSelector } from 'react-redux'

export const useMyRestaurant = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)


    useEffect(() => {
        const fetchMyRestaurant = async() => {
            try {
                const result = await axios.get(`${serverUrl}/api/restaurant/my-restaurant`,
                    {withCredentials: true}
                )
                if(result) dispatch(setRestaurantData(result.data))

            } catch (error) {
                console.log(error)
            }
        }
        fetchMyRestaurant()
    },[userData])

}
