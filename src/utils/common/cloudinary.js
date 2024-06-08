const cloudinary = require("cloudinary").v2;
const { StatusCodes } = require("http-status-codes");
const { ServerConfig } = require("../../config");
const AppError = require("../errors/app-error");
const fs = require("fs");

cloudinary.config({
    cloud_name: ServerConfig.CLOUD_NAME,
    api_key: ServerConfig.API_KEY,
    api_secret: ServerConfig.API_SECRET,
});

async function uploadOnCloudinary(localFilePath) {
    try {
        if (!localFilePath) {
            return new AppError(
                "Local File Path not available",
                StatusCodes.BAD_REQUEST
            );
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log(
            `Successfully Uploaded File on Cloudinary:- ${response.url}`
        );
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log(
            `Error Occured while Uploading file on cloudinary:- ${error}`
        );
        return null;
    }
}

module.exports = { uploadOnCloudinary };
