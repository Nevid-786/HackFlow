import { useState } from 'react'
import authService from '../Api/auth';


import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../Redux/AuthSlice';


const Login = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate()
    const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState([]);
const handleSubmit = async (e) => {
  e.preventDefault();
  let temp_error=[];
  if(!email || email.length<5){
    temp_error.push("Email must be filled and valid")
  }
  if(!password|| password.length<5){
    temp_error.push("password must be filled")
  }
  console.log(temp_error)
     if (temp_error.length > 0) {
      setError(temp_error);
      return; // stop here, don't call the API
    }
  try {
    const data = await authService.login(email, password);
    dispatch(login(data))
     navigate("/home")
      setError([]);
  } catch (error) {
    console.log(error.errors)

    
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center font-Hanken">HackFLow Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Login
                </button>
                <div className="">
                   <ul >
                     {error && error.length>0 ?(
                    error.map((e)=>{
                        return (<li className="text-red-500 text-sm mt-2">{e}</li>)
                    })):""
                }
                   </ul>
                </div>
                <h6 className="text-sm text-gray-600">
                    Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
                </h6>
                
            </div>
        </form>

      </div>
    </div>
  )
}

export default Login