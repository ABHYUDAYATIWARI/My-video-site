import React from 'react'
import {useForm } from "react-hook-form"
import Input from './Input'
import Button from './Button'
import authService from "../backendRelated/authentication.js"
import { Link, useNavigate } from 'react-router-dom'

function SignUp() {
    const navigate=useNavigate();
    const {register,handleSubmit,} = useForm()

    const onSubmit=(data)=>{
        console.log(data);
        authService.registerUser(data)
        authService.loginUser(data) 
        navigate("/")
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
            <Input label="Full Name *" placeholder="Enter your name" {...register("fullname")}/> 
            <Input label="User Name *" placeholder="username" {...register("username")} />
            <Input label="Email *" placeholder="Email" {...register("email")} />
            <Input label="password *" placeholder="password" {...register("password")} />
            <Input label="Avatar *" {...register("avatar")} type="file" />
            <Input label="Cover Image *" {...register("coverImage")} type="file" />
            <Button type='submit'>Submit</Button>
          
        </form>
        <Link to={"/"}>
        <Button bgColor='bg-gray-600'>Go back</Button>
        </Link>
    </div>
  )
}

export default SignUp