import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "./config.js";

cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.cloudApiKey,
    api_secret: config.cloudSecretKey,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}


export {uploadOnCloudinary}