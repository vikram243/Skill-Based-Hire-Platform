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
    if (!filePathOrUrl) return null;

    const response = await cloudinary.uploader.upload(filePathOrUrl, {
      resource_type: "auto",
    });

    // delete local file
    if (!filePathOrUrl.startsWith("http")) {
      fs.unlinkSync(filePathOrUrl);
    }

    // ⭐ ONLY RETURN WHAT YOU NEED
    return {
      public_id: response.public_id,
      originalUrl: response.secure_url
    };

  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);

    if (filePathOrUrl && !filePathOrUrl.startsWith("http")) {
      fs.unlinkSync(filePathOrUrl);
    }

    return null;
  }
};

export { uploadOnCloudinary };