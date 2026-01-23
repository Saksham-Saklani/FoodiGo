import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'


export const useCurrentUser = () =>{
    const dispatch = useDispatch()
     useEffect(() => {
        const fetchCurrentUser = async() =>{
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials: true})
                if(result) dispatch(setUserData(result.data))
                
            } catch (error) {
                console.log(error)
            }
        }
        fetchCurrentUser()
    }, [])
}