import { v2 as cloudinary } from "cloudinary";

export const getAvatarUrl = (publicId, size = 300) => {
  if (!publicId) return null;

  return cloudinary.url(publicId, {
    width: size,
    height: size,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
    secure: true,
  });
};