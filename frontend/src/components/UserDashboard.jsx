import React, { useRef } from 'react'
import Navbar from './Navbar'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { CircleChevronLeft, CircleChevronRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import FoodCard from './FoodCard'


function UserDashboard() {
  const ctgScrollRef = useRef()
  const restScrollRef = useRef()
  const { myCityRestaurants } = useSelector(state => state.user)
  const cityItems = myCityRestaurants?.restaurants?.flatMap((rest) => rest.items) || []
  console.log("city Items:",cityItems)


  const handleScroll = (ref, direction) => {

    if(ref.current){
      ref.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      })
    }
  }
  return (
    <div className='bg-[#f7fff6] flex flex-col items-center min-h-screen w-screen gap-5 pt-[80px] overflow-y-auto'>
      <Navbar/>
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>

          <h1 className='text-2xl sm:text-3xl text-gray-800 '>Inspirations for your first meal</h1>
          <div className='w-full relative'>
              <button className='w-8 h-8 absolute left-0 top-1/2 -translate-y-1/2 bg-[#83e34e] text-white p-1 rounded-full cursor-pointer hover:bg-[#83e34e]/80 shadow-lg z-10 flex items-center justify-center'
              onClick = {() => handleScroll(ctgScrollRef, 'left')}>
                <CircleChevronLeft />
              </button>
           <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={ctgScrollRef}>
           {categories.map((ctg, index) => {
              return <CategoryCard name={ctg.category} image={ctg.image} key={index}/>
            })}
           </div>
           <button className='w-8 h-8 absolute right-0 top-1/2 -translate-y-1/2 bg-[#83e34e] text-white p-1 rounded-full cursor-pointer hover:bg-[#83e34e]/80 shadow-lg z-10 flex items-center justify-center'
           onClick = {() => handleScroll(ctgScrollRef, 'right')}>
           <CircleChevronRight />
              </button>
          </div>

      </div>

      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>

          <h1 className='text-2xl sm:text-3xl text-gray-800 '>Top Restaurants in your city</h1>
          <div className='w-full relative'>
              <button className='w-8 h-8 absolute left-0 top-1/2 -translate-y-1/2 bg-[#83e34e] text-white p-1 rounded-full cursor-pointer hover:bg-[#83e34e]/80 shadow-lg z-10 flex items-center justify-center'
              onClick = {() => handleScroll(restScrollRef, 'left')}>
                <CircleChevronLeft />
              </button>
           <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={restScrollRef}>
           {myCityRestaurants?.restaurants?.map((rest, index) => {
              return <CategoryCard name={rest.name} image={rest.image} key={index}/>
            })}
           </div>
           <button className='w-8 h-8 absolute right-0 top-1/2 -translate-y-1/2 bg-[#83e34e] text-white p-1 rounded-full cursor-pointer hover:bg-[#83e34e]/80 shadow-lg z-10 flex items-center justify-center'
           onClick = {() => handleScroll(restScrollRef, 'right')}>
           <CircleChevronRight />
              </button>
          </div>
          

      </div>

      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>

          <h1 className='text-2xl sm:text-3xl text-gray-800 '>Suggested food items</h1>
          <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
            {cityItems.map((item) => {
              return <FoodCard data={item}/>
            })}

          </div>

      </div>
    </div>
  )
}

export default UserDashboard