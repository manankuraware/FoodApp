import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const uploadOnCloudinary = async (file) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
  });

  try {
    const result = await cloudinary.uploader.upload(file);
    fs.unlinkSync(file); //delete files
    return result.secure_url;
  } catch (error) {
    fs.unlinkSync(file); //delete files
    console.log(error);
  }
};

export default uploadOnCloudinary;
