import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadCloudinary=async (localfilepath)=>{
    try {
        if(!localfilepath) return 'please provide valid file path'
        const response= await cloudinary.uploader.upload(localfilepath,{resource_type:"auto"})
        // console.log("file uploadd successfully",response.url);
        fs.unlinkSync(localfilepath);
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath)
        return null
    }
}

const deletCloudinary=async(filePath)=>{
    try {
        const result=await cloudinary.uploader.destroy(filePath)
        console.log("file deleted");
        return result
    } catch (error) {
        console.log("error while deletin image::cloudinary");
    }
}

export {uploadCloudinary,deletCloudinary}