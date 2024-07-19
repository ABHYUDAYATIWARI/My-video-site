import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponce } from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const isAlreadySubs=await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(req.user._id),
                channel:channelId
            }
        }
    ])
    if(isAlreadySubs.length>0){
        await Subscription.findOneAndDelete({
            subscriber: req.user._id,
            channel: channelId
    })
        return res.status(200).json(new ApiResponce(200,{},"subcription deleted"))
    }
    const subs=await Subscription.create({
        subscriber:req.user._id,
        channel:channelId
    })
    
    return res.status(200).json(new ApiResponce(200,subs,"subcription added"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}