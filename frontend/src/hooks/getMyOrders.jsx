import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { setMyOrders } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'

export const useMyOrders = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)


    useEffect(() => {
        const fetchMyOrders = async() => {
            try {
                const result = await axios.get(`${serverUrl}/api/order/my-orders`,
                    {withCredentials: true}
                )
                if(result?.data?.orders) dispatch(setMyOrders(result.data.orders))
                else if(result?.data?.filteredOrders) dispatch(setMyOrders(result.data.filteredOrders))

            } catch (error) {
                console.log(error)
            }
        }
        fetchMyOrders()
    },[userData])

}