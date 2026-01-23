import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setRestaurantData } from '../redux/ownerSlice'

function OwnerItemCard({data}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleDeleteItem = async() => {
        try {
            const result = await axios.delete(`${serverUrl}/api/item/delete/${data._id}`, {withCredentials: true})

            dispatch(setRestaurantData(result.data))
            console.log('Item deleted successfully', result.data)

            
        } catch (error) {
            console.log('Error in deleting item', error)
        }
    }
  return (
    <div className='flex bg-white  w-full max-w-2xl rounded-lg shadow-md overflow-hidden border border-[#83e34e]'>
        <div className='w-36 h-full shrink-0 bg-gray-50'>
            <img src={data.image} className='w-full h-full object-cover'/>
        </div>
        <div className='flex flex-col justify-between p-3 flex-1'>
            <div >
                <h2 className='text-base font-semibold text-[#83e34e]'>{data.name}</h2>
                <p><span className='font-medium text-gray-70'>Category:</span> {data.category}</p>
                <p><span className='font-medium text-gray-70'>Food Type:</span> {data.foodType}</p>
            </div>
            <div className='flex items-center justify-between'>
                <p className='text-[#83e34e] font-bold '><span>₹</span>{data.price}</p>

                <div className='flex items-center gap-2 '>
                <div className='p-2 rounded-full hover:bg-[#83e34e]/10  text-[#83e34e] cursor-pointer'> 
                    <Pencil size={16} onClick={() => navigate(`/edit-item/${data._id}`)}/>
                </div>
                <div className='p-2 rounded-full hover:bg-[#83e34e]/10   text-[#83e34e] cursor-pointer'
                onClick={handleDeleteItem}>
                    <Trash2 size={16} />
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OwnerItemCard