import React from 'react'
import { Link } from 'react-router-dom'

function VideoCard({thumbnail,title,ownerUsername,ownerAvatar,duration,views,_id}) {

  const sampleImage="https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww"
  return (
    <Link to={`/video/${_id}`}>
    <div className=' text-white'>

      <div className='w-full sm:h-56 h-auto relative'>
        <img src={thumbnail || {sampleImage}} alt="thumbnail" className='w-full h-full'/>
        <div className='w-11 h-5 absolute bottom-1 right-1 bg-black text-white flex justify-center items-center'>{duration}</div>
      </div>

      <div className='w-full h-16 flex gap-x-6 mt-1'>
        <img src={ownerAvatar } alt="avatar" className='w-10 h-10 rounded-full'/>
        <div>
          <h3>{title}</h3>
          <span>{views} . {ownerUsername} </span>
        </div>
      </div>

    </div>
    </Link>
  )
}

export default VideoCard