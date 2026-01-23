import React, { useState, useEffect } from 'react'
import { CircleArrowLeftIcon, Utensils, UtensilsCrossed } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from'axios'
import { serverUrl} from '../App'
import { setRestaurantData } from '../redux/ownerSlice'
import { ClipLoader } from 'react-spinners'

function EditItem() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {itemId} = useParams()
    const [currentItem, setCurrentItem ] = useState(null)
    const categories = [
        'Main Course',
        'Dessert',
        'Chinese',
        'South Indian',
        'North Indian',
        'Pizza',
        'Burger',
        'Sandwich',
        'Salad',
        'Soup',
        'Drink',
        'Other'
    ]

    const { restaurantData } = useSelector(state => state.owner)
    const [ name, setName ] = useState("")
    const [ price, setPrice ] = useState(0)
    const [ category, setCategory ] = useState("")
    const [ foodType, setFoodType ] = useState("Veg")
    const[ frontendImage, setFrontendImage ] = useState(null)
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
        formData.append('price', price)
        formData.append('category', category)
        formData.append('foodType', foodType)


        if(backendImage){
            formData.append('image', backendImage)
        }

        const result = await axios.post(
            `${serverUrl}/api/item/edit/${itemId}`,
            formData,
            {withCredentials: true} 
        )

        dispatch(setRestaurantData(result.data))
        console.log('Restaurant created/updated successfully', result.data)
        if(result.data){
            setLoading(false)
            navigate('/')
        }
        }catch(error){
            console.log('Error in creating/updating restaurant', error)
        }
    }

    useEffect(() => {
        const fetchItem = async() => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get/${itemId}`,{withCredentials: true})
                console.log('Item fetched successfully', result.data)
                setCurrentItem(result.data)


            } catch (error) {
                console.log('Error in fetching item', error)
            }
        }
        fetchItem()
    },[itemId])

    useEffect(() => {
        setName(currentItem?.item?.name)
        setPrice(currentItem?.item?.price)
        setCategory(currentItem?.item?.category)
        setFoodType(currentItem?.item?.foodType)
        setFrontendImage(currentItem?.item?.image)
    }, [currentItem])

  return (
    <div className='bg-[#f7fff6] flex flex-col items-center justify-center p-6 relative min-h-screen'>
        <div className='absolute top-6 left-6 z-10 cursor-pointer mb-[10px]'
        onClick={() => navigate('/owner-dashboard')} >
            <CircleArrowLeftIcon size={25} color={'#83e34e'} />
        </div>
        <div className='max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-green-100'>
            <div className='flex flex-col items-center mb-6'>
                <div className='p-6 bg-green-100 rounded-full mb-4 '>
                    <UtensilsCrossed className='text-[#83e34e] w-16 h-16'/>
                </div>

               <div className='text-3xl font-extrabold text-gray-800'>
                Edit Menu Item
               </div>



            </div>

            <form className='space-y-5' onSubmit={handleSubmit} >
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Name:</label>
                <input type='text'
                 placeholder='Enter item name'
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
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Price(₹):</label>
                <input type='number'
                 placeholder='0'
                 className='w-full px-4 py-2 focus:outline-none border border-[#dadada] rounded-xl focus:ring-2 focus:ring-green-500'
                 value={price}
                 onChange={(e) => setPrice(e.target.value)}
                 />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Category:</label>
                <select 
                 className='w-full px-4 py-2 focus:outline-none border border-[#dadada] rounded-xl focus:ring-2 focus:ring-green-500 cursor-pointer'
                 value={category}
                 onChange={(e) => setCategory(e.target.value)}
                 >
                    <option value="">Select Category</option>
                    {categories.map((ctg, index) => {
                       return <option key={index} value={ctg}>{ctg}</option>
                    })}
                 </select>
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Food Type:</label>
                <select 
                 className='w-full px-4 py-2 focus:outline-none border border-[#dadada] rounded-xl focus:ring-2 focus:ring-green-500 cursor-pointer'
                 value={foodType}
                 onChange={(e) => setFoodType(e.target.value)}
                 >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    
                 </select>
            </div>
            <button className='w-full bg-[#83e34e] text-white px-5 py-3 shadow-md hover:shadow-lg  cursor-pointer rounded-xl hover:bg-green-600 transition-all duration-200 font-medium'
            disabled={loading}>
                {loading ? <ClipLoader color={'white'} size={20} /> : 'Update Item'}
            </button>

            
        </form>
            
        </div>
    </div>
  )
}

export default EditItem