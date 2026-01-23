import React, { useState } from 'react'
import { Vegan, Ham, Plus, Minus } from 'lucide-react'
import { FaStar, FaRegStar } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/userSlice'


function FoodCard({data}) {
  const [quantity, setQuantity] = useState(0)
  const dispatch = useDispatch()
  const { cartItems } = useSelector((state) => state.user)


  const renderRating = (rating) => {
    const stars = []

    for(let i = 1; i <= 5; i++){
      stars.push(
        (i <= rating) ? 
          (<FaStar className='text-yellow-500' />) :
           (<FaRegStar className='text-yellow-500' />)  
      )
    }
    return stars
  }

  const incrementQty = () => {
    const currentQty = quantity + 1
    setQuantity(currentQty)
  }
  const decrementQty = () => {
    if(quantity > 0){
    const currentQty = quantity - 1
    setQuantity(currentQty)
    }
  }

  return (
    <div className='flex flex-col w-[250px] bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden border-2 border-[#83e34e] transition-all duration-300 '>
      <div className='w-full h-[170px] flex items-center justify-center bg-white relative'>
      <div className='absolute top-3 right-3 bg-white rounded-full p-1 shadow'>
      {data.foodType === 'Veg' ? <Vegan size={16} color={'green'}/> : <Ham size={16} color={'red'}/> } 
      </div>
        <img src={data.image}
         className='w-full h-full object-cover transition-transform duration-300 hover:scale-110 '/>
      </div>
      <div className='flex-1 flex flex-col p-4'>
        <h1 className='text-gray-900 font-semibold text-base truncate'>{data.name}</h1>

        <div className='flex items-center gap-1 mt-1'>
          {renderRating(data.rating?.average || 0)}
          <span className='text-gray-500 text-xs'>
            {data.rating?.count || 0}
          </span>

        </div>

        <div className='flex items-center justify-between mt-auto pt-4'>

            <span className='text-gray-900 font-bold text-lg'>₹{data.price}</span>
            <div className='flex items-center border rounded-full overflow-hidden '>
              <button className='px-2 py-1 transition hover:bg-gray-100 cursor-pointer'
              onClick={incrementQty}>
                <Plus size={12} />
              </button>
              <span>{quantity}</span>
              <button className='px-2 py-1 transition hover:bg-gray-100 cursor-pointer'
              onClick={decrementQty}>
                <Minus size={12} />
              </button>
              <button className={` px-2 py-1 ${cartItems.some(i => i.id == data._id) ? "bg-gray-800" : "bg-[#83e34e]" }  text-white transition-colors`}
              onClick={() => quantity > 0 ? dispatch(addToCart(
                {
                  id: data._id,
                  name: data.name,
                  price: data.price,
                  quantity,
                  restaurant: data.restaurant,
                  image: data.image,
                  foodType: data.foodType,
                }
              )): ""}>
                <FaShoppingCart size={16} />
              </button>
            </div>

        </div>

      </div>
    </div>
  )
}

export default FoodCard