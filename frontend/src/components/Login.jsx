import React from 'react'
import {useForm } from "react-hook-form"
import Input from './Input'
import Button from './Button'
import authService from "../backendRelated/authentication.js"
import {login} from "../store/authSlice.js" 
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";

function Login() {

    const {register,handleSubmit,} = useForm()
    const navigate=useNavigate()
    const dispatch=useDispatch();
    const onSubmit=async(data)=>{
        const userData=await authService.loginUser(data)

        if(userData){
            localStorage.setItem("accessToken", userData.data.accessToken);
            localStorage.setItem("refreshToken", userData.data.refreshToken);
   
            localStorage.setItem("userData", userData);
        
        }
      
        dispatch(login({userData}))
        navigate("/")

    }
    const logoutbutton=async()=>{
        console.log("loggin out");
        await authService.logout()
    }

  return (
    <div className='max-w-sm w-full pt-8 m-auto text-white px-2 '>
        <div className='h-16 w-16 m-auto'>
            <Link to={"/"}>
            <img src="/image-removebg-preview.png" alt="" />
            </Link>
        </div>
        <div className='w-full flex justify-center mb-7 text-2xl font-bold'> <h1 className='text-white '>Sign Up</h1> </div>

        <form onSubmit={handleSubmit(onSubmit)} >
            
            <Input label="User Name *" placeholder="username" {...register("username")} />
          
            <Input label="password *" placeholder="password" {...register("password")} />
          
            <Button type='submit'>Sign In</Button>
          
        </form>
     

    </div>
  )
}

export default Login