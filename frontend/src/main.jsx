import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from "./store/store.js"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/Home.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MyChannel from './pages/MyChannel.jsx'
import Video from './pages/Video.jsx'

const router=createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/signup",
        element:<SignUpPage/>
      },
      {
        path:"/login",
        element:<LoginPage/>
      },
      {
        path:"/my-channel",
        element:<MyChannel/>
      },
      {
        path:"video/:slug",
        element:<Video/>
      }
      
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>

)
