import Axios from "axios"
import axiosInstance from './axionInstance';


const ApiURL=import.meta.env.VITE_API_URL


const getAllVideos=async ()=>{
    try {
        const responce=await Axios.get(`${ApiURL}/videos`)
        return responce.data
    } catch (error) {
        
        console.log("videoRelated error:: get all videos",error);
    }
}

const publishVideo=async(data)=>{
    
    try {
        const responce=await Axios.post(`${ApiURL}/videos`,{
            title:data.title,
            description:data.description,
            isPublished:data.isPublished, 
            videoFile:data.videoFile[0],
            thumbnail:data.thumbnail[0]
        },
        {headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials:true
        })

          console.log("video published successfully",responce.data);
          return responce.data
    } catch (error) {
        console.log("video related error ::publish video",error);
    }
}

const getVideoById=async (id)=>{
    try {
        const responce=await axiosInstance.get(`${ApiURL}/videos/${id}`)
        console.log("got the video");
        return responce.data
    } catch (error) {
        console.log("video related error :: getVideo by Id",error)
    }
}

const deleteVideo=async (id)=>{
    try {
        const responce=await axiosInstance.delete(`/videos/${id}`)
        console.log("video deleted");
        return responce.data
    } catch (error) {
        console.log("video related error :: delete video",error)
    }
}

const togglePublish=async(id)=>{
    try {
        const responce=await axiosInstance.patch(`/videos/toggle/publish/${id}`)
        console.log("video toggled");
        return responce.data
    } catch (error) {   
        console.log("video related error :: toggle publish");
    }
}

const myVideo=async(token)=>{
    try {
        const responce=await Axios.post(`${ApiURL}/videos/myVideos`,{},{ headers: {
        'Authoriztion': `Bearer ${token}`,
      },withCredentials:true})
        return responce.data
    } catch (error) {
        console.log(error);
    }
}
export default {
    getAllVideos,
    publishVideo,
    getVideoById,   
    deleteVideo,
    myVideo
}
