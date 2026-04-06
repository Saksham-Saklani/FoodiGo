import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { useSelector, useDispatch } from 'react-redux'
import { setLocation, setFullAddress } from '../redux/mapSlice'
import { ClipLoader } from 'react-spinners'
import { CircleArrowLeftIcon, MapPin, LocateFixed, Search, Motorbike, Smartphone, CreditCard } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { addMyOrder } from '../redux/userSlice'

function RecenterMap({location}){
    if(location.lat && location.lon){
        const map = useMap()
        map.setView([location.lat, location.lon], 16, {animate: true})
        return null
    }
}



function Checkout() {
    const { location, fullAddress } = useSelector((state) => state.map)
    const { cartItems, totalAmount, userData } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const apiKey = import.meta.env.VITE_GEO_API_KEY
    const [ addressInput , setAddressInput ] = useState("")
    const [ paymentMethod, setPaymentMethod ] = useState("COD")
    const deliveryFee = totalAmount > 500 ? 0 : 40
    const paymentAmount = totalAmount+deliveryFee


    async function getAddressByLatLng(lat, lng){
    const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`)
    dispatch(setFullAddress(result?.data?.features[0]?.properties?.formatted))
}

    function getCurrentLocation(){

            const latitude = userData?.user?.location.coordinates[1]
            const longitude = userData?.user?.location.coordinates[0]
            dispatch(setLocation({lat: latitude, lon: longitude}))
            getAddressByLatLng(latitude, longitude)
    }

    async function getLatLngByAddress(){
        const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)
        const {lat, lon} = result?.data?.features[0]?.properties
        dispatch(setLocation({lat, lon}))
    }

    const onMarkerDrag = (e) => {
        const {lat, lng} = e.target._latlng
        dispatch(setLocation({lat, lon:lng}))
        getAddressByLatLng(lat, lng)
    }

    useEffect(() => {
        setAddressInput(fullAddress)
    }, [fullAddress])

    const handlePlaceOrder = async() => {
       try {
         const result = await axios.post(`${serverUrl}/api/order/place-order`,{
            paymentMethod,
            deliveryAddress: {
               text: addressInput,
               latitude: location.lat,
               longitude: location.lon
            },
            totalAmount,
            cartItems
        },{withCredentials: true})

        if(paymentMethod == 'COD'){
            dispatch(addMyOrder(result.data.newOrder))
            navigate('/order-placed')
        }else{
            const razorpayOrder = result.data.razorpayOrder
            const orderId = result.data.orderId

            handleRazorpayPayment(razorpayOrder, orderId)

        }
           
       } catch (error) {
           console.log(error)
       }    
    }

    const handleRazorpayPayment = async(razorpayOrder, orderId) => {

        const options = {
           key: import.meta.env.VITE_RAZORPAY_API_KEY,
           amount: razorpayOrder.amount,
           currency: 'INR',
           name: 'Foodigo',
           description: 'Payment for food delivery order',
           order_id: razorpayOrder.id,
           handler: async function(response){
            try {
                const result = await axios.post(`${serverUrl}/api/order/verify-payment`,{
                    paymentId: response.paymentId,
                    orderId
                })
                dispatch(addMyOrder(result.data.newOrder))
                navigate('/order-placed')
                
                
            } catch (error) {
                console.log(error)
            }
           }
           
        
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }
        
    


    const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-[#f7fff6] flex items-center justify-center p-6'>
        <div className='absolute top-6 left-6 z-10 cursor-pointer mb-[10px]'
        onClick={() => navigate('/cart')} >
            <CircleArrowLeftIcon size={25} color={'#83e34e'} />
        </div>
        <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
            <h1 className='font-bold text-2xl text-gray-800'>Checkout</h1>

            <section>
                <h2 className='font-semibold text-lg mb-2 flex items-center gap-2 text-gray-800 '><MapPin size={20} color={'#83e34e'}/>Delivery Location</h2>
                <div className='flex gap-2 mb-3'>
                    <input className='outline-none border border-gray-300 rounded-lg p-2 flex-1 text-sm focus:ring-2 ring-[#83e34e]' type='text' placeholder='Enter your delivery address..'
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    />
                    <button className='bg-[#83e34e] text-white px-2 py-1 rounded-lg cursor-pointer hover:bg-[#66d128]'
                    onClick={getLatLngByAddress}
                    ><Search/></button>
                    <button className='bg-blue-500 text-white px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-600'
                    onClick={getCurrentLocation}>
                        <LocateFixed />
                    </button>
                </div>
                <div className='rounded-xl overflow-hidden border'>
                    <div className='w-full h-64 flex items-center justify-center'>
                        {location && location.lat!== 0 && location.lon !== 0 ? (
                            
                        <MapContainer
                            className={'w-full h-full'}
                            zoom={16}
                            center={[location?.lat, location?.lon]}>
                            <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        <RecenterMap location={location} />

                            <Marker
                              position={[location?.lat, location?.lon]}
                            draggable
                            eventHandlers={{dragend: onMarkerDrag}}
                            />
                        </MapContainer>
                        ) : (
                            <ClipLoader color={'#83e34e'} size={30} /> 
                        )}
                    </div>
                </div>
            </section>

            <section>
                <h2 className='font-semibold text-lg mb-2 flex items-center gap-2 text-gray-800'>Payment Method</h2>
                <div className='grid grid-col-1 sm:grid-cols-2 gap-4'>
                    <div className={`flex items-center gap-3 rounded-xl p-4 border cursor-pointer text-left transition ${paymentMethod === 'COD' ? 'border-[#83e34e] bg-green-50 shadow': 'border-gray-200 hover:border-gray-300 '}`}
                    onClick={() => setPaymentMethod('COD')}
                    >
                        <span className='bg-orange-100 inline-flex items-center justify-center rounded-full h-10 w-10'>
                            <Motorbike className='text-orange-600 text-xl' />
                            </span>
                        <div>

                            <p className='font-medium text-gray-800'>Cash On Delivery</p>
                            <p className='text-sm text-gray-500'>Pay when you receive your order</p>
                        </div>

                    </div>
                    <div className={`flex items-center gap-3 rounded-xl p-4 border cursor-pointer text-left transition ${paymentMethod === 'Online' ? 'border-[#83e34e] bg-green-50 shadow': 'border-gray-200 hover:border-gray-300 '}`}
                    onClick={() => setPaymentMethod('Online')}>
                        <span className='inline-flex items-center justify-center rounded-full h-10 w-10 bg-purple-100'>
                            <Smartphone className='text-purple-600 text-lg' />
                        </span>
                        <span className='inline-flex items-center justify-center rounded-full h-10 w-10 bg-blue-100'>
                            <CreditCard className='text-blue-600 text-lg' />
                        </span>
                        <div>
                            <p className='font-medium text-gray-800'>UPI / Debit / Credit Card</p>
                            <p className='text-sm text-gray-500'>Pay securely Online</p>
                        </div>

                    </div>
                </div>
            </section>

            <section>
                <h2 className='font-semibold text-lg mb-3 text-gray-800'>Order Summary</h2>
                <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
                    {cartItems.map((item, index) => (
                        <div key={index} className='flex justify-between text-sm text-gray-700'>
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>

                    ))}
                    <hr className='my-2 border-gray-200' />
                    <div className='flex justify-between font-medium text-gray-700'>
                        <span>Subtotal</span>
                        <span>₹{totalAmount}</span>
                    </div>
                    <div className='flex justify-between  text-gray-700'>
                        <span>Delivery Fee</span>
                        <span>{deliveryFee == 0 ? "Free" : '₹' + deliveryFee}</span>
                    </div>
                    <div className='font-bold text-lg flex justify-between text-[#83e34e] pt-2'>
                        <span>Total</span>
                        <span>₹{paymentAmount}</span>
                    </div>
                </div>

            </section>

            <button className='w-full py-3 font-semibold cursor-pointer bg-[#83e34e] text-white hover:bg-[#66d128] rounded-xl'
            onClick={handlePlaceOrder}>
                {paymentMethod == 'COD' ? "Place Order" : "Pay & Place Order"}
            </button>

        </div>
    </div>
  )
}

export default Checkout