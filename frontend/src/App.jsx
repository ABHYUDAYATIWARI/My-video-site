import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./App.css";
import {Outlet} from 'react-router-dom'
import authService from "./backendRelated/authentication.js"
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice.js";
import Temp from "./components/Temp.jsx"

function App() {
 const dispach=useDispatch();
  useEffect(() => {
    
    const fun=async()=>{
      const user=await authService.verifyToken()
    
      if(Object.keys(user.data).length!=0){
        const userData={data:{user:user.data}}
       
        dispach(login({userData}))
      }
      };
      fun();
  },[]);

  return (
  <>
    <Outlet/>
  </>
  )
}

export default App;
