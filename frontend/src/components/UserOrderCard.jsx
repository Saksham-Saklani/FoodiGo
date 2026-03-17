import React from 'react'

function UserOrderCard({data}) {
    console.log(data)
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB',{
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }
  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
        <div className='flex justify-between items-center border-b pb-2'>
            <div>
                <p className='font-semibold'>order#{data?._id?.slice(-6)}</p>
                <p className='text-sm text-gray-500'>{formatDate(data.createdAt)}</p>
            </div>
            <div>
                <p className='text-sm text-gray-500'>{data.paymentMethod}</p>
                <p className='text-blue-500 font-semibold'>{data.restaurantOrders?.[0].status}</p>
            </div>
        </div>

        {data.restaurantOrders?.map((order, index) => (
            <div className='bg-[#f7fff6]  rounded-lg p-3  space-y-3' key={index}>
                <p>{order.restaurant.name}</p>
                <div className='flex space-x-4 overflow-x-auto pb-2'>
                    {order.orderItems.map((item, index) => (
                        <div key={index} className='shrink-0 w-40 rounded-lg border bg-white p-2'>
                            <img src={item.item.image} alt={item.item.name} className='w-full h-24 oject-cover rounded' />
                            <p className='font-semibold text-sm mt-1'>{item.item.name}</p>
                            <p className='text-xs text-gray-500'>₹{item.price} x {item.quantity}</p>
                        </div>
                    ))}
                </div>

                <div className='flex justify-between items-center border-t pt-2'>
                   <div> <span className='text-sm text-gray-500'>Subtotal: </span><span className='font-semibold'>₹{order.subtotal}</span></div>
                   <div> <span className='text-blue-500 font-semibold'> {order.status}</span></div>

                </div>
            </div>

            
        ))}

        <div className='flex justify-between items-center border-t pt-2'>
            <p className='font-semibold' >Total: ₹{data.totalAmount}</p>
            <button className='bg-[#83e34e] hover:bg-[#71c93d] text-white text-sm cursor-pointer px-4 py-2 rounded-lg'>Track Order</button>
        </div>
    </div>
  )
}

export default UserOrderCard