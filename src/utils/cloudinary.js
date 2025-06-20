import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({
    cloud_name: 'diwyhtg7d',
    api_key: '188725332176239',
    api_secret: process.env.CLOUDINARY_URL
});


const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null

        // uploading file on cloudinary 
        const uploadResult = await cloudinary.uploader
            .upload(localFilePath, {resource_type:'auto'})
            .catch((error) => {
                console.log(error);
            });
        
        return uploadResult;
        console.log(uploadResult);

    }
     catch (error) {

        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation failed 
        console.log("ERROR ::", error)
    }
}



export {uploadOnCloudinary}