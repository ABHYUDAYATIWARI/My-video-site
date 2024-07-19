import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import SideBar from '../components/SideBar'
import videoService from "../backendRelated/videoRel"
import VideoCard from "../components/VideoCard"

function Home() {
  const [videos,setVideos]=useState([]);
    const getVideo=async()=>{
      const responce=await videoService.getAllVideos()
      // console.log(responce.data);
      setVideos(responce.data)
    }
    useEffect(() => {
     getVideo()
    //  console.log(({...videos[4]}));
    }, [])
    
  
  return (
    <div className='text-white'>
        <Header/>
        <div className="">
            <div className='border-r border-white  min-h-[calc(100vh-80px)] fixed bottom-0  '>
            <SideBar/>
            </div>
            <div className='lg:ml-64 sm:ml-14 p-2 sm:grid sm:grid-cols-[repeat(auto-fit,_minmax(375px,_1fr))]'>
              {videos.map((video)=>{
                if(video.isPublished){
                  return(
                 <div key={video._id} className='m-4  sm:h-64 sm:max-w-[25rem] h-auto'>
                  <VideoCard {...video}  />
                  </div>)
                }
              })}
            </div>
        </div>

    </div>    
  )
}

export default Home