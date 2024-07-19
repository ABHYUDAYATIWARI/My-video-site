import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import PostVideo from "../components/PostVideo";
import { useSelector } from "react-redux";
import userService from "../backendRelated/UserRel";
import videoRel from "../backendRelated/videoRel";
import VideoCard from "../components/VideoCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function MyChannel() {
  const [info, setInfo] = useState(null);
  const [forSubs, setForSubs] = useState(null);
  const [myVideos, setMyVideos] = useState();
  const isAuthor = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);
  const getinfo = async () => {
    const responce = await userService.getcurrentUser();
    const vid = await videoRel.myVideo(userData.data.accessToken);
    setMyVideos(vid.data);
    setInfo(responce.data);

    if (info) {
      const resForSub = await userService.userChannel(info.username);
      setForSubs(resForSub.data);
    }
  };
  getinfo()
  useEffect(() => {
    if(!info){
    getinfo();}
  }, [info]);

  const postRef = useRef();
  const showPostVid = () => {
    postRef.current.classList.toggle("hidden");
  };
 if (!isAuthor) {
    return (
      <div className="text-white w-full h-svh">
        <Header />
        <div className="">
          <div className="border-r border-white  min-h-[calc(100vh-80px)] fixed bottom-0  ">
            <SideBar />
          </div>
          <div className="lg:ml-64 sm:ml-14 p-2  flex justify-center items-center mt-4">
            <Link to={"/login"}>
              <div className="text-4xl">Login to publish Video</div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (!info || !forSubs) {
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
  // console.log(myVideos);
 

  return (
    <div className="text-white">
      <Header />
      <div className="">
        <div className="border-r border-white  min-h-[calc(100vh-80px)] fixed bottom-0  ">
          <SideBar />
        </div>
        <div className="lg:ml-64 sm:ml-14  ">
          <div className="w-full h-48 overflow-hidden">
            <img src={info.coverImage} alt="" className="w-full" />
          </div>
          <div className="p-3 flex gap-x-3">
            <img
              src={info.avatar}
              alt="avatar"
              className="w-28 h-28 rounded-full -translate-y-12 "
            />
            <div>
              <h2> {info.username} </h2>
              <h2> {forSubs.channelSubscriberCount} Subscribers </h2>
            </div>
          </div>
          <div className="mb-2  w-auto flex justify-around">
            <h3 className="bg-orange-500 w-fit px-3 py-2 rounded-lg">
              My Videos
            </h3>
            <button onClick={showPostVid}>
              <h3 className="bg-orange-500 w-fit px-3 py-2 rounded-lg">
                Post a Video
              </h3>
            </button>
            <div
              ref={postRef}
              className="absolute hidden inset-x-0 md:pl-72 sm:pl-16 z-10 sm:-translate-y-56 top-20 sm:top-auto overflow-auto h-[35rem] "
            >
              <div className="text-white font-bold text-4xl border border-white p-5 bg-[#121212] z-10 flex justify-between">
                Upload Video
                <button
                  className=" text-2xl border rounded-full border-white px-3"
                  onClick={showPostVid}
                >
                  {" "}
                  <FontAwesomeIcon icon={faXmark} />{" "}
                </button>
              </div>
              
              <PostVideo ref={postRef}/>
            </div>
          </div>
          <hr />

          <div className="lg:ml-16 sm:ml-14 p-2 sm:grid sm:grid-cols-[repeat(auto-fit,_minmax(370px,_1fr))]">
            {myVideos.map((video) => {
              
                return (
                  <div
                    key={video._id}
                    className="m-4  sm:h-64 sm:max-w-[25rem] h-auto"
                  >
                    <VideoCard {...video} />
                  </div>
                );
              
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyChannel;
