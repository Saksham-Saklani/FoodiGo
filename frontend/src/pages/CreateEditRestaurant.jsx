import React, { useState } from 'react'
import { CircleArrowLeftIcon, Utensils } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from'axios'
import { serverUrl} from '../App'
import { setRestaurantData } from '../redux/ownerSlice'

function CreateEditRestaurant() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentCity, currentState, currentAddress } = useSelector(state => state.user)
    const { restaurantData } = useSelector(state => state.owner)
    const [ name, setName ] = useState(restaurantData?.restaurant?.name || "")
    const [ address, setAddress ] = useState(restaurantData?.restaurant?.address || currentAddress)
    const [ city, setCity ] = useState(restaurantData?.restaurant?.city || currentCity)
    const [ state, setState ] = useState(restaurantData?.restaurant?.state || currentState)
    const[ frontendImage, setFrontendImage ] = useState(restaurantData?.restaurant?.image || null)
    const [ backendImage, setBackendImage] = useState(null)
    const [ loading, setLoading ] = useState(false)

    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    } 
    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)

        try{
            const formData = new FormData()

        formData.append('name', name)
        formData.append('city', city)
        formData.append('state', state)
        formData.append('address', address)

        if(backendImage){
            formData.append('image', backendImage)
        }

        const result = await axios.post(
            `${serverUrl}/api/restaurant/create-edit`,
            formData,
            {withCredentials: true} 
        )

        dispatch(setRestaurantData(result.data))
        if(result.data){
            setLoading(false)
            navigate('/')
        }
        console.log('Restaurant created/updated successfully', result.data)
        }catch(error){
            console.log('Error in creating/updating restaurant', error)
        }
    }

  return (
    <div className='bg-[#f7fff6] flex flex-col items-center justify-center p-6 relative min-h-screen'>
        <div className='absolute top-6 left-6 z-10 cursor-pointer mb-[10px]'
        onClick={() => navigate('/owner-dashboard')} >
            <CircleArrowLeftIcon size={25} color={'#83e34e'} />
        </div>
        <div className='max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-green-100'>
            <div className='flex flex-col items-center mb-6'>
                <div className='p-6 bg-green-100 rounded-full mb-4 '>
                    <Utensils className='text-[#83e34e] w-16 h-16'/>
                </div>

               <div className='text-3xl font-extrabold text-gray-800'>
               {restaurantData ? "Edit Restaurant" : "Add Restaurant"}
               </div>



            </div>

            <form className='space-y-5' onSubmit={handleSubmit}>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Name:</label>
                <input type='text'
                 placeholder='Enter restaurant name'
                 className='w-full px-4 py-2 focus:outline-none border border-[#dadada] rounded-xl focus:ring-2 focus:ring-green-500'
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Image:</label>
                <input type='file'
                 className='w-full px-4 py-2 focus:outline-none cursor-pointer border border-[#dadada] rounded-xl focus:ring-2 focus:ring-green-500'
                 onChange={handleImage}
                 />
                {frontendImage &&
                 <div className='mt-2'>
                    <img src={frontendImage} className='w-full h-40 object-cover border rounded-lg' />
                </div>
                }
            </div>
            <div className='grid grid-col-1 md:grid-cols-2 gap-4 items' >
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>State:</label>
                <input type='text'
                 placeholder='Enter state'
                 className='w-full px-4 py-2 focus:outline-none border border-[#dadada] rounded-xl focus:ring-2 focus:ring-green-500'
                 value={state}
                 onChange={(e) => setState(e.target.value)}
                 />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>City:</label>
                <input type='text'
                 placeholder='Enter city'
                 className='w-full px-4 py-2 focus:outline-none border border-[#dadada] rounded-xl focus:ring-2 focus:ring-green-500'
                 value={city}
                 onChange={(e) => setCity(e.target.value)}
                 />
            </div>


            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Address:</label>
                <input type='text'
                 placeholder='Enter restaurant address'
                 className='w-full px-4 py-2 focus:outline-none border border-[#dadada] rounded-xl focus:ring-2 focus:ring-green-500'
                 value={address}
                 onChange={(e) => setAddress(e.target.value)}
                 />
            </div>
            <button className='w-full bg-[#83e34e] text-white px-5 py-3 shadow-md hover:shadow-lg  cursor-pointer rounded-xl hover:bg-green-600 transition-all duration-200 font-medium' disabled={loading}>
                {loading ? <ClipLoader color={'white'} size={20} /> : restaurantData ? "Update Restaurant" : "Add Restaurant"}
            </button>

            
        </form>
            
        </div>
    </div>
  )
}

export default CreateEditRestaurant