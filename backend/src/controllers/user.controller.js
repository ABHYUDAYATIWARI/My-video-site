import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { deletCloudinary, uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken= async (userid)=>{
    try {
        const user=await User.findById(userid)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken

        user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"something went wrong when creating access and refresh token")
    }
}

const registerUser =asyncHandler( async (req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullname,email,username,password}=req.body
    if( 
        [fullname,email,username,password].some((e)=> e?.trim()==="")
    ){
        throw new ApiError(400,"All field are requires")
    }

    const existUser= await User.findOne({
        $or:[{ username },{ email }]
    })
    if(existUser){
        throw new ApiError(409,"user already exist")
    }

    const avatarLocalPath=  await  req.files?.avatar[0]?.path;
   
    const coverImageLocalPath= await req.files?.coverImage?.[0]?.path;  
    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // } 
    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required")
    }

    const avatar=await uploadCloudinary(avatarLocalPath)
    const coverImage=await uploadCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400,"avatar file is required")
    }
    const user= await User.create({
        fullname,
        avatar:avatar.url,
        email:email,
        coverImage:coverImage?.url || "",
        password,
        username:username.toLowerCase()
    })

    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"something went wrong while creating the user")
    }

    return res.status(201).json(
        new ApiResponce(200,createdUser,"user registered successfully")
    )

})

const loginUser=asyncHandler(async (req,res)=>{
    //get user detail from frontend
    //validate if entries are not empty
    //find user in database 
    //validate password
    //generate access and refresh token
    //send cookie
    //login user

    const {username,email,password}=req.body

    if(!(username || email)) throw new ApiError(400,"email or username is required")

    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user) throw new ApiError(404,"user not found register")

    const isPassValid= await user.isPasswordCorrect(password)
    if(!isPassValid) throw new ApiError(401,"invalid user password")

    const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)
    
    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")
    res.cookie("setmycookie","this is my xoo")
    const options={
        httpOnly:true,
        secure:true
    }
    console.log("user logged in ");
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponce(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "user logged in successfuly"
        )
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset:{
                    refreshToken:1
                }
            },
            {
                new:true
            }
        )
        const options={
            httpOnly:true,
            secure:true
        }
        return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponce(200,{},"User logged out"))
})

const refreshAccessToken=asyncHandler(async (req,res)=>{
    const incomingAccessToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incomingAccessToken){
        throw new ApiError(401,"unautorized access")
    }
    const decodedToken= jwt.verify(incomingAccessToken,process.env.REFRESH_TOKEN_SECRECT)

    const user =await User.findById(decodedToken?._id)
    if(user){
        throw new ApiError(401,"invalid refresh token")
    }
    
    if(incomingAccessToken!==user?.refreshToken){
        throw new ApiError(401,"refresh token is expired")
    }

    const options={
        httpOnly:true,
        secure:true
    }
    const {accessToken,newRefreshToken}= await generateAccessAndRefreshToken(user._id)
    console.log("refreshAccessToken");
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
        new ApiResponce(
            200,
            {
                accessToken,refreshToken:newRefreshToken
            },
            "access token refreshed"
        )
    )

})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    const user=await User.findById(req.user?._id)

    const isPasscorrect=user.isPasswordCorrect(oldPassword)
    if(!isPasscorrect){
        throw new ApiError(401,"wrong password")
    }

    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponce(200,{},"password changes successfully")
    )
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponce(200,req.user,"current user exported"))
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullname,email}=req.body

    if(!fullname && !email){
        throw new ApiError(400,"All fields are required")
    }

    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set :{fullname,
            email
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res.status(200)
    .json(new ApiResponce(200,user,"Account detail updated"))

})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar=await uploadCloudinary(avatarLocalPath)
    if(!avatar){
        throw new ApiError(400,"Error while uploading avatar")
    }
    deletCloudinary(req.user.avatar)
//delete old image 
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    )

    return res.status(200).
    json(
        new ApiResponce(200,user,"Avatar image updated")
    )
})

const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image is missing")
    }

    const coverImage=await uploadCloudinary(coverImageLocalPath)
    if(!coverImage){
        throw new ApiError(400,"Error while uploading coverImage")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    )
    
    return res.status(200).
    json(
        new ApiResponce(200,user,"cover image updated")
    )
})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
   
    const {usernamefu}= req.params
    if(!usernamefu?.trim()){
        throw new ApiError(400,"username is missing")
    }

    const channel=await User.aggregate([
        {
            $match:{
                username:usernamefu
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size:"$subscribers"
                },
                channelSubscriberCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id, "$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                fullname:1,
                username:1,
                subscriberCount:1,
                channelSubscriberCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1,
                email:1
                //also send created at 
            }
        }
    ])
   
    if(!channel?.length){
        throw new ApiError(400,"channel not found")
    }

    return res.status(200)
    .json(new ApiResponce(200,channel[0],"user found"))


})

const getWatchHistory=asyncHandler(async(req,res)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponce(200,user[0].WatchHistory,"watch history fetched"))
})

const getUserUsingAccesstoken=asyncHandler(async(req,res)=>{
    const reftoken=req.cookies?.refreshToken
   
    if(!reftoken){
        return res.status(200).json(new ApiResponce(200,{},"didnot find token"))
    }
    const user = await User.findOne({
        refreshToken:reftoken
    })

    if(!user){
        return res.status(200).json(new ApiResponce(200,{},"token expired"))
    }
    return res.status(200).json(new ApiResponce(200,user,"user got"))
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    getUserUsingAccesstoken
}