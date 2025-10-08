import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "./config.js";

cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.cloudApiKey,
    api_secret: config.cloudSecretKey,
});

const uploadOnCloudinary = async (filePathOrUrl) => {
    try {
        if(!filePathOrUrl) return null;
        const response = await cloudinary.uploader.upload(filePathOrUrl,{
            resource_type:"auto"
        })
        if(!filePathOrUrl.startsWith('http')){
            fs.unlinkSync(filePathOrUrl)
        }
        return response;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error.message);
        if(filePathOrUrl&&!filePathOrUrl.startsWith('http')){
            await fs.unlinkSync(filePathOrUrl)
        }
        return null;
    }
}
export {uploadOnCloudinary}