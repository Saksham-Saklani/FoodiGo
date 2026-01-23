import {React, useState} from 'react'
import { Eye, EyeOff } from 'lucide-react'
import googleIcon from '../assets/google-color-icon.svg'
import axios from 'axios'
import '../index.css'
import { serverUrl } from '../App'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {app ,auth} from '../utils/firebase'
import { GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function Login() {
  const primaryColor = '#83e34e'
  const hoverColor = '#e64323'
  const bgColor = '#f7fff6'
  const borderColor = '#ddd'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async () => {
    try {
      if(!email) return setError('Email is required')
      if(!password) return setError('Password is required')
      setLoading(true)
      
      
      const result = await axios.post(`${serverUrl}/api/auth/login`,{
        email,
        password,
      },{withCredentials: true},
      dispatch(setUserData(result.data)))

      setLoading(false)
      setError('')

      if(result){
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

    try{
      const {data} = await axios.post(`${serverUrl}/api/auth/google-signin`,{
        email: result.user.email,
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
        <p className='text-gray-600 mb-4'>Login to get started with delicious food deliveries</p>


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
            required
            />
          <button className='absolute right-3 top-0.5 bottom-0.5 cursor-pointer' 
          onClick={() => {setShowPassword(!showPassword)}}
          > 
          {showPassword ? <Eye color='gray' size={15}/> : <EyeOff color='gray' size={15} />}
          </button>
          </div>
          <div className='text-right font-medium cursor-pointer text-[#83e34e] mb-4 text-sm' onClick={() => navigate('/forgot-password')}>
            Forgot Password
          </div>
        </div>
        
        <button className={`w-full py-2 mt-2 rounded-3xl text-white font-medium bg-[#83e34e] hover:bg-[#6bc03e] transition duration-300 cursor-pointer`}
        onClick={handleLogin}
        >
          {loading ? <ClipLoader color={'white'} size={15} /> : 'Sign In'}
        </button>
        {/* Display Error */}
        {error && (<p className='text-red-500 text-xs mt-4 text-center border border-red-500 rounded-lg p-1'>
          {error}
          </p>)}
      <p className='text-center text-sm text-gray-400 mt-1'>Or</p>
      <button className='w-full py-2 mt-2 rounded-3xl border border-gray-300 text-gray-400 font-medium flex items-center justify-center gap-2 transition duration-300 cursor-pointer'
      onClick={handleGoogleSignIn}>
        <img src={googleIcon} alt='google' className='w-5 h-5' />
        Continue with Google
      </button>
      <p className='text-center mt-3 text-sm text-gray-400'>Create an account: <span onClick={() => navigate('/register')} className='text-[#83e34e] cursor-pointer'>Sign Up</span></p>

      </div>
    </div>
  )
}

export default Login