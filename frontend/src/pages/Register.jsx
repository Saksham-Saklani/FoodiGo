import {React, useState} from 'react'
import { Eye, EyeOff } from 'lucide-react'
import googleIcon from '../assets/google-color-icon.svg'
import axios from 'axios'
import '../index.css'
import { serverUrl } from '../App'
import {app ,auth} from '../utils/firebase'
import { GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function Register() {
  const primaryColor = '#83e34e'
  const hoverColor = '#e64323'
  const bgColor = '#f7fff6'
  const borderColor = '#ddd'

  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('Customer')
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleRegister = async () => {
    try {
      if(!fullname) return setError('Full name is required')
      if(!email) return setError('Email is required')
      if(!password) return setError('Password is required')
      if(!mobile) return setError('Mobile number is required')
      if(password.length < 6) return setError('Password must be at least 6 characters')
      if(mobile.length < 10) return setError('Mobile number must be at least 10 digits')

      setLoading(true)

      const result = await axios.post(`${serverUrl}/api/auth/register`,{
        fullname,
        email,
        password,
        mobile,
        role
      },{withCredentials: true})

      setError('')
      setLoading(false)

      if(result){
        dispatch(setUserData(result.data))
        navigate('/')
      }

    } catch (error) {
      setLoading(false)
      setError(error?.response?.data?.message)
    }
  }

  const handleGoogleSignIn = async () => {

    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)

    if(!mobile){
      return setError('Mobile number is required')
    }

    try{
      const {data} = await axios.post(`${serverUrl}/api/auth/google-signin`,{
        fullname: result.user.displayName,
        email: result.user.email,
        mobile,
        role
      },{withCredentials: true})

      setError('')

     if(data){
      dispatch(setUserData(data))
      navigate('/')
     }

    } catch(error){

      setError(error?.response?.data?.message)
    }
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-2' style={{backgroundColor: bgColor}}>
      <div className={`w-full max-w-sm bg-white rounded-xl shadow-lg p-6`} style = {{border: `1px solid ${borderColor}`}}>
        <h1 className={`text-3xl font-bold mb-1 text-[#83e34e]`}>FoodiGo</h1>
        <p className='text-gray-600 mb-4'>Sign up to get started with delicious food deliveries</p>

        {/* Fullname */}
        <div className='mb-2'>
          <label htmlFor='fullName' className='block mb-0.5 text-sm font-medium text-gray-600'>Full Name:</label>
          <input 
            type='text'
            id='fullName' 
            className='w-full px-3 py-1 border rounded-3xl border-gray-300 focus:outline-none focus:border-green-500'
            placeholder='Enter your Full Name'
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            />
        </div>

        {/* Email */}
        <div className='mb-2'>
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

        {/* Mobile */}
        <div className='mb-2'>
          <label htmlFor='mobile' className='block text-sm mb-0.5 font-medium text-gray-600'>Mobile:</label>
          <input 
            type='number'
            id='mobile' 
            className='w-full px-3 py-1 border rounded-3xl border-gray-300 focus:outline-none focus:border-green-500'
            placeholder='Enter your Phone Number'
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            />
        </div>

        {/* Password */}
        <div className='mb-2'>
          <label htmlFor='password' className='block text-sm mb-0.5 font-medium text-gray-600'>Password:</label>
          <div className='relative'>
          <input 
            type={showPassword ? 'text' : 'password'}
            id='password' 
            className='w-full px-3 py-1 border rounded-3xl border-gray-300 focus:outline-none focus:border-green-500'
            placeholder='Enter your Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
          <button className='absolute right-3 top-0.5 bottom-0.5 cursor-pointer' 
          onClick={() => {setShowPassword(!showPassword)}}
          > 
          {showPassword ? <Eye color='gray' size={15}/> : <EyeOff color='gray' size={15} />}
          </button>
          </div>
        </div>

        {/* Role */}
        <div className='mb-2'>
          <label htmlFor='role' className='block text-sm mb-0.5 font-medium text-gray-600'>Role:</label>
          <div className='flex gap-2'>
            {['Customer', 'Owner', 'Delivery Partner'].map((r) => (
              <button className='text-center flex-1 text-sm font-medium px-3 py-0.5 rounded-3xl border transition-colors cursor-pointer' 
              onClick={() => setRole(r)}
              style={role == r ? 
                {backgroundColor: primaryColor, color: 'white'}
                : {backgroundColor: 'white', color: 'gray'}
              }
              >{r}</button>
            ))}
          </div>
        </div>

        <button className={`w-full py-2 mt-2 rounded-3xl text-white font-medium bg-[#83e34e] hover:bg-[#6bc03e] transition duration-300 cursor-pointer`}
        onClick={handleRegister}
        >
          {loading ? <ClipLoader color={'white'} size={15} /> : 'Sign Up'}
        </button>
          {/* Display Error */}
          {error && (<p className='text-red-500 text-xs mt-4 text-center border border-red-500 rounded-lg p-1'>
            {error}
          </p>)}
      <p className='text-center text-sm text-gray-400 mt-1'>Or</p>
      {/* Google Sign In */}
      <button className='w-full py-2 mt-2 rounded-3xl border border-gray-300 text-gray-400 font-medium flex items-center justify-center gap-2 transition duration-300 cursor-pointer'
      onClick={handleGoogleSignIn}>
        <img src={googleIcon} alt='google' className='w-5 h-5' />
        Continue with Google
      </button>
      <p className='text-center mt-3 text-sm text-gray-400'>Already have an account ? <span onClick={() => navigate('/login')} className='text-[#83e34e] cursor-pointer'>Sign In</span></p>

      </div>
    </div>
  )
}

export default Register