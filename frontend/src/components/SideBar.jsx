import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClapperboard, faClockRotateLeft, faHouse,faThumbsUp, faUserCheck, faVideo } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux';

function SideBar() {
  const navigate=useNavigate();
  const isAuthor = useSelector((state) => state.auth.status);
  const myChannel=()=>{
    if(isAuthor){
      navigate("/my-channel")
    }else{
      navigate("/login")
    }
  }
  return (
    <div className='lg:w-64 sm:block hidden' >
        <div className='flex justify-center items-center my-6 w-full'>
            <div className='w-full p-2 flex gap-y-[6px] flex-col text-white text-lg'>
              <Link to={"/"}>
                <div className='border border-white flex gap-x-5 w-full h-9 items-center p-2 hover:bg-orange-500 hover:text-black'><FontAwesomeIcon icon={faHouse} /> <span className='hidden lg:block'>Home</span> </div>
              </Link>  
                <div className='border border-white flex gap-x-5 w-full h-9 items-center p-2'><FontAwesomeIcon icon={faThumbsUp} /> <span className='hidden lg:block'>Liked Videos</span></div>
                <div className='border border-white flex gap-x-5 w-full h-9 items-center p-2'><FontAwesomeIcon icon={faClockRotateLeft} /> <span className='hidden lg:block'>History</span> </div>
                <div className='border border-white flex gap-x-5 w-full h-9 items-center p-2'><FontAwesomeIcon icon={faVideo} /><span className='hidden lg:block'>My Content</span> </div>
                <div className='border border-white flex gap-x-5 w-full h-9 items-center p-2'><FontAwesomeIcon icon={faClapperboard} /> <span className='hidden lg:block'>Playlist</span> </div>
                <Link to={"/my-channel"}>
                  <div className='border border-white flex gap-x-5 w-full h-9 items-center p-2 hover:bg-orange-500 hover:text-black'><FontAwesomeIcon icon={faUserCheck} /> <span className='hidden lg:block'>My Channel</span></div>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default SideBar