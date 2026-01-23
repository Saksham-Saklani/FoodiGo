import React, { useState } from 'react'
import { MapPin, Search, ShoppingCart, LogOut, Box, X, Plus } from 'lucide-react'
import { useSelector,useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import axios from 'axios'
import { serverUrl } from "../App"
import { useNavigate } from 'react-router-dom'
function Navbar() {

    const  { userData, currentCity, cartItems  } = useSelector(state => state.user)
    const { restaurantData } = useSelector(state => state.owner)
    const [showMenu, setShowMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleLogout = async() => {
        try{
            const result = await axios.get(`${serverUrl}/api/auth/logout`,{
                withCredentials: true})

                if(result){
                    dispatch(setUserData(null))
                }
        } catch(error){
            console.error(error)
        }
    }

  return (
    <div className='w-screen h-[80px] bg-[#f7fff6] flex items-center justify-between md:justify-center px-20 top-0 fixed z-[9999] gap-[30px] overflow visible'>
            <h1 className='text-3xl font-bold text-[#83e34e] mb-2'>
                FoodiGo
            </h1>

            {showSearch && userData?.user?.role === 'Customer' && 
                        <div className='md:hidden w-[90%] fixed top-[80px] left-[5%] h-[70px] flex items-center bg-white rounded-lg shadow-xl gap-[20px]'>
                        {/* Location */}
                        <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-2 border-gray-400'>
                        <MapPin size={25} color={'#83e34e'}/>
                        <div className='text-gray-600 truncate w-[80%]'>{currentCity }</div>
                        </div>
                        {/* Search */}
                        <div className='flex items-center  w-[80%] gap-[10px]'>
                            <Search  size={25} color={'#83e34e'} />
                            <input 
                            className='w-full outline-0 text-gray-700 px-[10px]'
                            placeholder='Search delicious food...'/>
                        </div>
                    </div>
            }
           

                {userData?.user?.role === 'Customer' && 
                <div className='md:w-[50%] w-[40%] h-[60px] md:flex hidden items-center bg-white rounded-lg shadow-xl gap-[20px]'>
                {/* Location */}
               <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-2 border-gray-400'>
               <MapPin size={25} color={'#83e34e'}/>
               <div className='text-gray-600 truncate w-[80%]'>{currentCity}</div>
               </div>
               {/* Search */}
               <div className='flex items-center  w-[80%] gap-[10px]'>
                   <Search  size={25} color={'#83e34e'} />
                   <input 
                   className='w-full outline-0 text-gray-700 px-[10px]'
                   placeholder='Search delicious food...'/>
               </div>
           </div>
                }

        <div className='flex items-center gap-4 '>

        {userData?.user?.role === 'Owner' ?
        <>
        {restaurantData && 
        <>
        <button className='hidden md:flex items-center gap-1 p-2 rounded-full bg-[#83e343]/10 text-[#83e343] cursor-pointer'
        onClick={() => navigate('/add-item')}>
            <Plus size={20} />
            <span>Add Menu Item</span>
        </button>
        <button className=' md:hidden flex items-centercursor-pointer p-2 rounded-full bg-[#83e343]/10 text-[#83e343] cursor-pointer'
        onClick={() => navigate('/add-item')}>
            <Plus size={20} />
        </button>
        </>
        }
        <button className=' flex bg-[#83e343]/10 text-[#83e343]  items-center gap-2 rounded-lg text-sm relative font-medium py-1 px-3 cursor-pointer'>
            <Box size={20}/>
            <span className='hidden md:block whitespace-nowrap'>My Orders</span>
            <span className='absolute -right-1 -top-2 bg-[#83e343] text-white rounded-full w-4 h-4 flex items-center justify-center text-xs'>0</span>
        </button>
        </>
        :
        <>
        {showSearch ?
                    <X className='md:hidden cursor-pointer' size={25} color={'#83e34e'}
                    onClick={() => setShowSearch(false)}
                    />
                    :
                <Search className='md:hidden cursor-pointer' size={25} color={'#83e34e'}
                onClick={() => setShowSearch(true)}
                />
            }
             <div className='relative cursor-pointer' onClick={() => navigate('/cart')}>
                <ShoppingCart size={25} color={'#83e34e'} />
                <span className='absolute top-[-12px] right-[-9px] text-[#83e34e]'>{cartItems.length}</span>
            </div>

            <button className='hidden md:flex bg-[#83e343]/10 text-[#83e343]  items-center gap-2 rounded-lg text-sm  font-medium py-1 px-3 cursor-pointer'>
            <Box size={20}/>
            <span className='whitespace-nowrap'>My Orders</span>
        </button>
            
        </>
        }
       
            <div className='bg-[#83e343] text-white w-[40px] h-[40px] text-[18px] font-semibold shadow-xl flex items-center justify-center rounded-full cursor-pointer'
            onClick={() => setShowMenu(!showMenu)}>
                 {userData?.user?.fullname.slice(0,1)}
            </div>
                {showMenu && 
                    <div className='fixed top-[80px] md:right-[5%] right-[10px] lg:right-[10%] shadow-2xl rounded-xl bg-white  w-auto min-w-[180px] p-[20px] flex flex-col gap-[10px] z-[9999] '>
                    <div className='font-semibold text-[17px] '>{userData?.user?.fullname}</div>
                   {userData?.user?.role === 'Customer' &&
                    <div className='text-[#83e343] md:hidden text-[17px] flex items-center gap-2 font-semibold cursor-pointer'>
                        <Box size={20}/>
                        My Orders
                    </div>}
                    <div className='text-[#83e343] font-semibold cursor-pointer flex items-center gap-2'
                        onClick={handleLogout}>
                        <LogOut size={20}/>Log Out
                    </div>
                </div>
                }
        </div>
    </div>
  )
}

export default Navbar