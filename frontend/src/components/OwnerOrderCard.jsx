import React, {useState} from 'react'
import { Mail, Phone } from 'lucide-react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setOrderStatus } from '../redux/userSlice'

function OwnerOrderCard({data}) {
    const [availablePartners, setAvailablePartners] = useState([])
    const dispatch = useDispatch()
    const handleUpdateStatus = async(orderId, restaurantId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${restaurantId}`, {status}, {withCredentials: true})
            console.log(result.data)
            dispatch(setOrderStatus({restaurantId, orderId, status}))
            setAvailablePartners(result.data.availablePartners || [])
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
        <div>
            <h1 className='text-lg font-semibold text-gray-800'>{data.user.fullname}</h1>
            <div className='flex items-center gap-2 text-sm text-gray-500 mt-1'><Mail size={16}/>{data.user.email}</div>
            <div className='flex items-center gap-2 text-sm text-gray-500 mt-1'><Phone size={16}/>{data.user.mobile}</div>
        </div>
        <div>
            <p className='text-xs text-gray-500'>{data?.deliveryAddress?.text}</p>
        </div>

        <div className='flex space-x-4 overflow-x-auto pb-2'>
                    {data.restaurantOrders.orderItems.map((item, index) => (
                        <div key={index} className='shrink-0 w-40 rounded-lg border bg-white p-2'>
                            <img src={item.item.image} alt={item.item.name} className='w-full h-24 oject-cover rounded' />
                            <p className='font-semibold text-sm mt-1'>{item.item.name}</p>
                            <p className='text-xs text-gray-500'>₹{item.price} x {item.quantity}</p>
                        </div>
                    ))}
        </div>

        <div className='flex justify-between items-center pt-3 mt-auto '>
            <p className='text-[#83e34e] font-semibold'><span className=' text-sm text-gray-500 font-light'>Status: </span>{data.restaurantOrders.status}</p>
            <select className='text-[#83e34e] focus:outline-0 focus:ring-2 border px-3 py-1 rounded-md border-[#83e34e] text-sm'
            onChange={(e) => handleUpdateStatus(data._id, data.restaurantOrders.restaurant._id, e.target.value)}>
                <option value="">Select</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
            </select> 
        </div>

        {data.restaurantOrders.status == 'Out for Delivery' && (
            <div className='mt-3 p-2 rounded-lg bg-green-50 border'>
                <p className='text-sm text-gray-800'>Available Delivery Partners:</p>
                {availablePartners?.length > 0 ? (
                    availablePartners.map((p, index) => (
                        <div key={index} className='text-xs text-gray-500 p-2'>
                            {p.fullname} - {p.mobile}
                        </div>
                    ))
                ) : (
                    <p className='text-sm text-gray-500'>Waiting for delivery partners</p>
                ) }
                        
                   
                
            </div>
        )}

        <div className='text-right text-sm font-bold text-gray-800 mt-2'>
            <p>Total: ₹{data.restaurantOrders.subtotal}</p>
        </div>
    </div>


  )
}

export default OwnerOrderCard