import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import videoService from "../backendRelated/videoRel";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faClapperboard,
  faClockRotateLeft,
  faHouse,
  faThumbsUp,
  faUserCheck,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import userService from "../backendRelated/UserRel"

function Video() {
  const [video, setvideo] = useState(null);
  const [owner, setOwner] = useState(null)
  const [loading, setloading] = useState(true);
  const { slug } = useParams();
  const getVid = async () => {
    try {
      const video = await videoService.getVideoById(slug);
      setvideo(video.data);
    
 
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };
  useEffect(() => {
    setloading(true);
    getVid();
    setloading(false);
  }, [slug]);


  const navigate = useNavigate();
  const isAuthor = useSelector((state) => state.auth.status);

  if (!video) {
    return (
      <div className="flex flex-wrap">
        <div className="p-2 w-full">
          <h1 className="text-2xl font-bold hover:text-gray-500 text-white">
            loading....
          </h1>
        </div>
      </div>
    );
  }

const getOwner=async()=>{
   const owner=await userService.userChannel(video.ownerUsername)
 
   setOwner(owner)
}
getOwner()

if (!owner) {
  return (
    <div className="flex flex-wrap">
      <div className="p-2 w-full">
        <h1 className="text-2xl font-bold hover:text-gray-500 text-white">
          loading....
        </h1>
      </div>
    </div>
  );
}
  return (
    <div className="text-white">
      <Header />
      <div className="">
        <div className="border-r border-white  min-h-[calc(100vh-80px)] fixed bottom-0  ">
          <div className="sm:block hidden">
            <div className="flex justify-center items-center my-6 w-full">
              <div className="w-full p-2 flex gap-y-[6px] flex-col text-white text-lg">
                <Link to={"/"}>
                  <div className="border border-white flex gap-x-5 w-full h-9 items-center p-2">
                    <FontAwesomeIcon icon={faHouse} />{" "}
                  </div>
                </Link>
                <div className="border border-white flex gap-x-5 w-full h-9 items-center p-2">
                  <FontAwesomeIcon icon={faThumbsUp} />
                </div>
                <div className="border border-white flex gap-x-5 w-full h-9 items-center p-2">
                  <FontAwesomeIcon icon={faClockRotateLeft} />{" "}
                </div>
                <div className="border border-white flex gap-x-5 w-full h-9 items-center p-2">
                  <FontAwesomeIcon icon={faVideo} />
                </div>
                <div className="border border-white flex gap-x-5 w-full h-9 items-center p-2">
                  <FontAwesomeIcon icon={faClapperboard} />{" "}
                </div>
                <Link to={"/my-channel"}>
                  <div className="border border-white flex gap-x-5 w-full h-9 items-center p-2 hover:bg-orange-500 hover:text-black">
                    <FontAwesomeIcon icon={faUserCheck} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:ml-14 sm:ml-14 p-2 w-2/3 ">
          <div className="w-full ">
          <video src={video.videoFile} controls autoPlay muted={false} className="w-full"></video>
          </div>

          <div className="w-full border border-white rounded-md mt-6 px-3 ">
              <h2 className="text-xl font-bold">{video.title}</h2>
              <h4>{video.views} Views . Created at {video.createdAt.slice(0,10)}  </h4>

              <div className="flex gap-x-4 mt-2">
                <img src={video.ownerAvatar} alt="avatat" className="w-12 h-12 rounded-full" />
                <div >
                  <h4>{video.ownerUsername}</h4>
                  <h4> {owner.data.channelSubscriberCount} </h4>
                </div>
              </div>
              <hr  className="mt-3 mb-3"/>
              <div className="mb-3">
                <h3>
                  {video.description}
                </h3>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Video;
