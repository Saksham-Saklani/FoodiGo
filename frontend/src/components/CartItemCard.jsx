import React,{ useState} from 'react'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { updateQuantity, removeCartItem } from '../redux/userSlice'

function CartItemCard({data}) {

  const dispatch = useDispatch()
  const incrementQty = (id, currentQty) => {
    if(currentQty > 0 ){
    dispatch(updateQuantity({id, quantity: currentQty+1}))

    }
  }
  const decrementQty = (id, currentQty) => {
    if(currentQty > 0){
    dispatch(updateQuantity({id, quantity: currentQty-1}))

    }
  }

  const removeItem = (id) => {
    dispatch(removeCartItem(id))
  }

  return (
    <div className='flex justify-between items-center p-6 border shadow rounded-xl bg-white '>
      <div className='flex items-center gap-4'>
        <img src={data.image} className='object-cover w-20 h-20 rounded-xl border' />
        <div>
          <h1 className='font-medium text-gray-800'>{data.name}</h1>
          <p className='text-sm text-gray-500'>₹{data.price} x {data.quantity}</p>
          <p className='font-bold text-gray-900'>₹{data.price*data.quantity}</p>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <div className='rounded-full border overflow-hidden'>
          <button className='px-2 py-1 transition hover:bg-gray-100 cursor-pointer'
          onClick={() => incrementQty(data.id, data.quantity)}
              >
                <Plus size={16} />
              </button>
              <span>{data.quantity}</span>
              <button className='px-2 py-1 transition hover:bg-gray-100 cursor-pointer'
              onClick={() => decrementQty(data.id, data.quantity)}
              >
                <Minus size={16} />
              </button>
        </div>
        <button className='rounded-full  bg-red-100 p-2 cursor-pointer'
        onClick={() => removeItem(data.id)} >
          <Trash2 size={16} color={'red'} />
        </button>

      </div>


    </div>
  )
}

export default CartItemCard