import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponce } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { deletCloudinary, uploadCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const videos= await Video.find({}).sort({views:-1})

    if(!videos) throw new ApiError(500,"failed to fetch videos")
        
    return res.status(200).json(new ApiResponce(200,videos,"videos fetched on basis of views"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description,isPublished} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!(title,description)) throw new ApiError(400,"title and description is required")

    const videoLocalUrl=req?.files?.videoFile[0]?.path
    const thumbnailLocalUrl=req?.files?.thumbnail[0]?.path
                                        
    if(!videoLocalUrl) throw new ApiError(400,"video file is required")

    const videoOnCloud=await uploadCloudinary(videoLocalUrl)
    const thumbnailOnCloud=await uploadCloudinary(thumbnailLocalUrl)

    if(!videoOnCloud) throw new ApiError(500,"error while uploading the file")
    
        function formatDurationToNumber(durationInSeconds) {
            // Ensure the input is a number
            if (typeof durationInSeconds !== 'number') {
              throw new TypeError('Input must be a number representing duration in seconds');
            }
          
            // Handle negative durations (if applicable)
            if (durationInSeconds < 0) {
              throw new Error('Duration cannot be negative');
            }
          
            const minutes = Math.floor(durationInSeconds / 60); // Calculate minutes (integer)
            const seconds = (durationInSeconds % 60).toFixed(2); // Get remaining seconds with two decimals
          
            // Combine minutes and formatted seconds into a single number (avoid string concatenation)
            return parseFloat(`${minutes}.${seconds}`);
          }

    const video=await Video.create({
        title,
        description,
        videoFile:videoOnCloud.url,
        thumbnail:thumbnailOnCloud.url,
        duration:formatDurationToNumber(videoOnCloud.duration),
        owner:req.user._id,
        isPublished,
        ownerAvatar:req.user.avatar,
        ownerUsername:req.user.username
    })
    return res.status(200)
    .json(new ApiResponce(200,video,"video uploaded successfully"))
    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video=await Video.findById(videoId)
    if(!video) throw new ApiError(400,"invalid video id")
    
    return res.status(200).json(new ApiResponce(200,video,"found the video"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!videoId) throw new ApiError(400,"video not found")

    let video= await Video.findByIdAndUpdate(videoId,{
     
        title:req.body?.title,
        description:req.body?.description,
    },{new:true})

    if(req.file?.path){
        const thumbnail=uploadCloudinary(req.file.path)
        video=await Video.findByIdAndUpdate(videoId,{
            thumbnail:thumbnail.url
        })
    }
    if(!video) throw new ApiError(500,"error while uploading the file")
    return res.status(200).json(new ApiResponce(200,video,"details updated"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video=await Video.findById(videoId)
    deletCloudinary(video.thumbnail)
    deletCloudinary(video.videoFile)
    await Video.findByIdAndDelete(videoId)

    return res.status(200).json(new ApiResponce(200,{},"video deleted"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    let video= await Video.findById(videoId)
    const publishStaus=video.isPublished
    video=await Video.findByIdAndUpdate(videoId,{isPublished:!publishStaus},{new:true})

    return res.status(200).json(new ApiResponce(200,video,"toggeled publish status"))
})

const myVideos=asyncHandler(async(req,res)=>{

const vidoes=await Video.aggregate([
        {
            $match:{
                ownerUsername:req.user.username
            }
        }
    ])

    if(!vidoes.length){
        return res.status(200)
        .json(new ApiResponce(200,{},"no videos published"))
    }

    return res.status(200)
    .json(new ApiResponce(200,vidoes,"got the videos"))
})
const updateViews=asyncHandler(async(req,res)=>{
    const { videoId } = req.params
    const video=await Video.findById(videoId)
    const oldViews =video.views
    const newVideo= await Video.findByIdAndUpdate(videoId,{
        views:oldViews+1
    },{new:true})

    return res.status(200)
    .json(new ApiResponce(200,newVideo,"views updated"))
})
export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    myVideos
}