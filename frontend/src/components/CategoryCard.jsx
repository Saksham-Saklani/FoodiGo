import React from 'react'


function CategoryCard({name, image, onClick}) {
  return (
    <div className='w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 border-[#83e34e] shrink-0 shadow-xl bg-white shadow-gray-200 hover:shadow-lg transition-shadow overflow-hidden relative'
    onClick={onClick}>
        <img src={image}
        className=' w-full h-full object-cover transform hover:scale-110 transition-transform duration-300'/>
        <div className='absolute bottom-0 left-0 w-full bg-[#ffffff96] bg-opacity-95 px-3 py-1 text-sm font-medium shadow text-gray-700 backdrop-blur rounded-t-xl text-center'>
            {name}
        </div>
    </div>


  )
}

export default CategoryCard