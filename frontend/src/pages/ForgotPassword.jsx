import React, { useState } from 'react'
import { CircleArrowLeftIcon, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { ClipLoader } from 'react-spinners'


function ForgotPassword() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    async function handleSendOtp(){

      try{
        if(!email) return setError('Email is required')
        setLoading(true)

        const result = await axios.post(
          `${serverUrl}/api/auth/send-otp`,
          {email},
          {withCredentials: true}
        )

        setError('')
        setLoading(false)
        setStep(2)
      } catch(error){
        setLoading(false)
        setError(error?.response?.data?.message)
      }
  }
  
    async function handleVerifyOtp(){
      try {
        if(!otp) return setError('OTP is required')
        setLoading(true)

        const result = await axios.post(
      `${serverUrl}/api/auth/verify-otp`,
      {email, otp},
      {withCredentials: true}
    )

        setError('')
        setLoading(false)
        setStep(3)
      } catch (error) {
        setLoading(false)
        setError(error?.response?.data?.message)
      }
    }
  
    async function handleResetPassword(){
      try{
        if(!newPassword) return setError('New password is required')
        if(!confirmPassword) return setError('Confirm password is required')
        if(newPassword !== confirmPassword) return setError('Passwords do not match')
        if(newPassword.length < 6) return setError('Password must be at least 6 characters')

        setLoading(true)

        const result = await axios.post(
          `${serverUrl}/api/auth/reset-password`,
          {email, newPassword, confirmPassword},
          {withCredentials: true}
        )

        setError('')
        setLoading(false)
        navigate('/login')
      } catch(error){
        setLoading(false)
        setError(error?.response?.data?.message)
      }
    }

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-[#f7fff6] p-4'>
        <div className='max-w-md shadow-lg rounded-xl w-full p-8 bg-white'>
            <div className='flex items-center gap-4'>
            <button className= 'cursor-pointer' onClick={() => navigate('/login')}><CircleArrowLeftIcon size={25} color={'gray'}/></button>
            <h1 className='text-2xl font-semibold text-[#83e34e]'>Forgot Password</h1>
            </div>

            {step == 1 && (
              <div>
                <div className='mt-8'>
          <label htmlFor='email' className='block mb-0.5 text-sm font-medium text-gray-600'>Email:</label>
          <input 
            type='email'
            id='email' 
            className='w-full px-3 py-1 border rounded-3xl border-gray-300 focus:outline-none focus:border-green-500'
            placeholder='Enter your Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>

        <button className='w-full py-2 mt-6 rounded-3xl text-white font-medium bg-[#83e34e] hover:bg-[#6bc03e] transition duration-300 cursor-pointer'
        onClick={handleSendOtp}
        >
          {loading ? <ClipLoader color={'white'} size={15} /> : 'Send OTP'}
        </button>
        {/* Display Error */}
        {error && (<p className='text-red-500 text-xs mt-4 text-center border border-red-500 rounded-lg p-1'>
          {error}
          </p>)}
              </div>
            )}

            {step == 2 && (
              <div>
                <div className='mt-8'>
          <label htmlFor='otp' className='block mb-0.5 text-sm font-medium text-gray-600'>OTP:</label>
          <input 
            type='number'
            id='otp' 
            className='w-full px-3 py-1 border rounded-3xl border-gray-300 focus:outline-none focus:border-green-500'
            placeholder='Enter OTP'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            />
        </div>

        <button className='w-full py-2 mt-6 rounded-3xl text-white font-medium bg-[#83e34e] hover:bg-[#6bc03e] transition duration-300 cursor-pointer'
        onClick={handleVerifyOtp}
        >
          {loading ? <ClipLoader color={'white'} size={15} /> : 'Verify'}
        </button>
        {/* Display Error */}
        {error && (<p className='text-red-500 text-xs mt-4 text-center border border-red-500 rounded-lg p-1'>
          {error}
          </p>)}
              </div>
            )}

            {step == 3 && ( 
              <div>
                <div className='mb-4 mt-8'>
          <label htmlFor='newPassword' className='block text-sm mb-0.5 font-medium text-gray-600'>New Password:</label>
          <div className='relative'>
          <input 
            type={showPassword ? 'text' : 'password'}
            id='newPassword' 
            className='w-full px-3 py-1 border rounded-3xl border-gray-300 focus:outline-none focus:border-green-500'
            placeholder='Enter New Password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            />
          <button className='absolute right-3 top-0.5 bottom-0.5 cursor-pointer' 
          onClick={() => {setShowPassword(!showPassword)}}
          > 
          {showPassword ? <Eye color='gray' size={15}/> : <EyeOff color='gray' size={15} />}
          </button>
          </div>
          
        </div>
                <div className='mb-2'>
          <label htmlFor='confirmPassword' className='block text-sm mb-0.5 font-medium text-gray-600'>Confirm Password:</label>
          <div className='relative'>
          <input 
            type={showPassword ? 'text' : 'password'}
            id='newPassword' 
            className='w-full px-3 py-1 border rounded-3xl border-gray-300 focus:outline-none focus:border-green-500'
            placeholder='Re-enter Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
          <button className='absolute right-3 top-0.5 bottom-0.5 cursor-pointer' 
          onClick={() => {setShowPassword(!showPassword)}}
          > 
          {showPassword ? <Eye color='gray' size={15}/> : <EyeOff color='gray' size={15} />}
          </button>
          </div>
          
        </div>
       
        <button className='w-full py-2 mt-6 rounded-3xl text-white font-medium bg-[#83e34e] hover:bg-[#6bc03e] transition duration-300 cursor-pointer'
        onClick={handleResetPassword}
        >
          {loading ? <ClipLoader color={'white'} size={15} /> : 'Reset Password'}
        </button>
        {/* Display Error */}
        {error && (<p className='text-red-500 text-xs mt-4 text-center border border-red-500 rounded-lg p-1'>
          {error}
          </p>)}
              </div>
            )}

           

            
        </div>
    </div>
  )
}

export default ForgotPassword