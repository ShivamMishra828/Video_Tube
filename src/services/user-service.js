const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Cloudinary } = require("../utils/common");

const userRepository = new UserRepository();

async function signUp(data) {
    try {
        const existingUser = await userRepository.getUserByEmail(data.email);
        if (existingUser) {
            throw new AppError(
                "User already exists with given email.",
                StatusCodes.BAD_REQUEST
            );
        }

        if (!data.avatar) {
            throw new AppError(
                "Avatar Path not available",
                StatusCodes.BAD_REQUEST
            );
        }

        const avatar = await Cloudinary.uploadOnCloudinary(data.avatar);
        if (!avatar) {
            throw new AppError(
                "Avatar didn't uploaded on Cloudinary",
                StatusCodes.BAD_REQUEST
            );
        }

        const user = await userRepository.create({
            fullName: data.fullName,
            email: data.email,
            password: data.password,
            avatar: avatar.url,
        });

        return user;
    } catch (error) {
        console.log(error);
        if (error.statusCode == StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "Error Occured while Signing Up the User.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    signUp,
};
