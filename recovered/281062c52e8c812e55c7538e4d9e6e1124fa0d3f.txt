import React from 'react'
import { CircleCheckBig } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function OrderPlaced() {
    const navigate = useNavigate()
  return (
    <div className='min-h-screen w-full px-4 bg-[#f7fff6] flex flex-col items-center justify-center text-center relative overflow-hidden'>
        <CircleCheckBig size={100} color={'#83e34e'} className='mb-4' />
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Order Placed Successfully</h1>
        <p className='text-gray-600 mb-4 max-w-md'>Thank you for your purchase. Your order is being prepared.
            You can track your order status in the 'My Orders' section.
        </p>
        <button className='bg-[#83e34e] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#66d128]'
        onClick={() => navigate('/my-orders')}>Back to My Orders</button>

        
    </div>
  )
}

export default OrderPlaced