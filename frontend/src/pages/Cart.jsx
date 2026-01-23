import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleArrowLeftIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import CartItemCard from '../components/CartItemCard'

function Cart() {
    const navigate = useNavigate()
    const {cartItems, totalAmount} = useSelector(state => state.user)
    console.log(cartItems)
  return (
    <div className='min-h-screen bg-[#f7fff6] flex justify-center p-6'>
        <div className='w-full max-w-4xl'>
                    <div className='z-10 flex items-center cursor-pointer mb-6 gap-[20px]'
        onClick={() => navigate('/user-dashboard')} >
            <CircleArrowLeftIcon size={25} color={'#83e34e'} />
            <h1 className='text-2xl text-start font-bold text-gray-800'>Your Cart</h1>
        </div>
        {cartItems?.length == 0 ? (
            <p className='text-lg text-center text-gray-500'>Cart is empty</p>
        ):(
            <>
            <div className='space-y-4'>
                {cartItems?.map((item, index) => (
                <CartItemCard data={item} key={index}/>
            ))}
            </div>
            <div className='mt-6 p-6 border flex items-center justify-between shadow rounded-xl bg-white '>
                <h1 className='font-bold text-lg'>Total Amount:</h1>
                <span className='text-[#83e34e] font-bold text-xl'>₹{totalAmount}</span>
            </div>
            <div className='mt-6 flex justify-end'>
                <button className='bg-[#83e34e] text-white px-6 py-3 text-lg font-medium rounded-lg hover:bg-[#66d128] transition cursor-pointer'
                onClick={() => {navigate('/checkout')}}>
                    Proceed to Checkout
                </button>
            </div>
            </>
        )}
        </div>


    </div>
  )
}

export default Cart