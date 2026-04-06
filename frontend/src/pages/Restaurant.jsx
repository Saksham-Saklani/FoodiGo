import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import axios from 'axios'
import { FaStore } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa";
import FoodCard from '../components/FoodCard';
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function Restaurant() {
    const {restaurantId} = useParams()
    const [items, setItems] = useState([])
    const [restaurant, setRestaurant] = useState([])
    const navigate = useNavigate()

    const handleGetItems = async() => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-restaurant-items/${restaurantId}`, {withCredentials: true})
            setItems(result.data.items)
            setRestaurant(result.data.restaurant)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetItems()
    },[restaurantId])
  return (
    <div className='min-h-screen bg-gray-50'>
        <button className='flex items-center gap-2 bg-black/70 hover:bg-black/30 absolute top-4 left-4 text-white rounded-2xl px-3 py-2 z-20 cursor-pointer shadow-lg'
        onClick={() => navigate('/')}>
            <IoChevronBack />
            <span>Back</span>
        </button>
        {restaurant && 
        <div className='w-full h-64 md:h-80 lg:h-96 relative'>
            <img src={restaurant.image} className='w-full h-full object-cover '/>
            <div className='absolute inset-0 bg-linear-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4'>
                <FaStore className='text-4xl text-white mb-3 drop-shadow-md'/>
                <h1 className='text-3xl md:text-5xl font-extrabold drop-shadow-lg text-white mb-[10px]'>{restaurant.name}</h1>
                <p className='text-gray-200 font-medium text-lg'>{restaurant.address}</p>
            </div>
            
        </div>}
        <div className='max-w-7xl mx-auto px-6 py-10'>
           <div className='flex items-center justify-center gap-2 mb-10'>
                <FaUtensils className='text-3xl text-[#83e34e]'/>
                <h2 className='text-3xl font-bold text-gray-800'>Our Menu</h2>
           </div>
           {items.length > 0 ? (
            <div className='flex flex-wrap gap-6 justify-center'>
                {items.map((item) => {
                    return <FoodCard data={item}/>
                } )}
            </div>
           ):
           <p className='text-center text-gray-400 text-lg'>No items available</p>}

        </div>
        
    </div>
  )
}

export default Restaurant