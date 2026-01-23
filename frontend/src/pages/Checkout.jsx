import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { setLocation, setFullAddress } from '../redux/mapSlice'
import { ClipLoader } from 'react-spinners'
import { CircleArrowLeftIcon, MapPin, LocateFixed, Search, TrendingUpDown } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function RecenterMap({location}){
    if(location.lat && location.lon){
        const map = useMap()
        map.setView([location.lat, location.lon], 16, {animate: true})
        return null
    }
}



function Checkout() {
    const { location, fullAddress } = useSelector((state) => state.map)
    const dispatch = useDispatch()
    const apiKey = import.meta.env.VITE_GEO_API_KEY
    const [ addressInput , setAddressInput ] = useState("")


    async function getAddressByLatLng(lat, lng){
    const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`)
    dispatch(setFullAddress(result?.data?.features[0]?.properties?.formatted))
}

    function getCurrentLocation(){
        navigator.geolocation.getCurrentPosition(async(position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            dispatch(setLocation({lat: latitude, lon: longitude}))
            getAddressByLatLng(latitude, longitude)
    })}

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

        </div>
    </div>
  )
}

export default Checkout