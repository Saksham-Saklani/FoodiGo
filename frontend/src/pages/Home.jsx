import React from 'react'
import OwnerDashboard from '../components/OwnerDashboard'
import { useSelector } from 'react-redux'
import DeliveryPartnerDashBoard from '../components/DeliveryPartnerDashBoard'
import UserDashboard from '../components/UserDashboard'
function Home() {
  const { userData } = useSelector((state) => state.user)
  return (
    <>
    {userData?.user?.role === 'Customer' && <UserDashboard />}
    {userData?.user?.role === 'Owner' && <OwnerDashboard />}
    {userData?.user?.role === 'Delivery Partner' && <DeliveryPartnerDashBoard />}
    </>
  )
}

export default Home