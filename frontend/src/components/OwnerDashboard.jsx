import React from 'react'
import Navbar from './Navbar'
import { Utensils, Pencil, HandPlatter } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OwnerItemCard from './OwnerItemCard'

function OwnerDashboard() {
  const { restaurantData } = useSelector(state => state.owner)
  const navigate = useNavigate()
  console.log(restaurantData)
  return (
    <div className='bg-[#f7fff6] pt-[80px] flex flex-col w-full min-h-screen items-center'>
      <Navbar />

      {!restaurantData &&
        <div className='flex justify-center items-center p-4 sm:p-6'>
          <div className='bg-white w-full max-w-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100'>
            <div className='flex flex-col items-center text-center'>
              <Utensils className='text-[#83e34e] w-16 h-16 mb-4 sm:w-20 sm:h-20' />
              <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>Add Your Restaurant</h2>
              <p className='text-gray-600 text-sm mb-4 sm:text-base'>Join FoodiGo and reach thousands of hungry customers everyday.</p>
              <button className='bg-[#83e34e] text-white px-5 sm:px-6 py-2 shadow-md hover:bg-green-600 transition-colors duration-200 font-medium rounded-full cursor-pointer'
                onClick={() => navigate('/create-edit-restaurant')}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      }

      {
        restaurantData &&
        <div className='flex flex-col items-center w-full gap-6 px-4 sm:px-6 mt-10'>
          <h1 className='text-2xl sm:text-3xl text-gray-900 text-center flex items-center gap-3'>
            <Utensils className='w-12 h-12 text-[#83e34e]' />
            Welcome to {restaurantData?.restaurant?.name}
          </h1>

          <div className='w-full max-w-3xl shadow-lg rounded-xl bg-white border border-green-100 overflow-hidden hover:shadow-2xl transition-all duration-300 relative'>
            <div className='absolute top-4 right-4 bg-[#83e34e] text-white p-2 rounded-full cursor-pointer'>
                <Pencil size={20} onClick={() => navigate('/create-edit-restaurant')} />
            </div>
            <img src={restaurantData?.restaurant?.image} 
            alt={restaurantData?.restaurant?.name}
            className='w-full h-auto'
            />

            <div className='p-4 sm:p-6'>
              <p className='font-bold text-xl sm:text-2xl text-gray-800 mb-4'>{restaurantData?.restaurant?.name}</p>
              <p className='text-gray-500'>{restaurantData?.restaurant?.city}, {restaurantData?.restaurant?.state}</p>
              <p className='text-gray-500 mb-4'>{restaurantData?.restaurant?.address}</p>
            </div>

          </div>

          {restaurantData?.restaurant?.items.length === 0 && 
            <div className='flex justify-center items-center p-4 sm:p-6'>
            <div className='bg-white w-full max-w-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100'>
              <div className='flex flex-col items-center text-center'>
                <HandPlatter className='text-[#83e34e] w-16 h-16 mb-4 sm:w-20 sm:h-20' />
                <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>Add Your Menu Items</h2>
                <p className='text-gray-600 text-sm mb-4 sm:text-base'>Sell your delicious creations with our customers by adding them to your menu.</p>
                <button className='bg-[#83e34e] text-white px-5 sm:px-6 py-2 shadow-md hover:bg-green-600 transition-colors duration-200 font-medium rounded-full cursor-pointer'
                  onClick={() => navigate('/add-item')}>
                  Add Food
                </button>
              </div>
            </div>
          </div>
          }

          {
            restaurantData?.restaurant?.items.length > 0 &&
              <div className='flex flex-col items-center gap-4 w-full max-w-3xl'>
                {restaurantData?.restaurant?.items.map((item, index) => (
                  <OwnerItemCard key={index} data={item}/>
                ))}
              </div>
          }
        </div>

      }
    </div>
  )
}

export default OwnerDashboard