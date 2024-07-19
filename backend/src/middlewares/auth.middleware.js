import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        const token= req.cookies?.accessToken || req.header("Authoriztion")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"Unautorized access")
        }
    
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRECT)
    
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401,"invalid access token")
        }
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401,"some error in verifyjwt")
    }

})

