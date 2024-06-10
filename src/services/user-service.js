const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Cloudinary, Auth } = require("../utils/common");
const { User } = require("../models");

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

async function login(data) {
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError(
                "User not exists with given email.",
                StatusCodes.NOT_FOUND
            );
        }

        const isPasswordCorrect = await user.checkPassword(data.password);
        if (!isPasswordCorrect) {
            throw new AppError("Invalid Credentials", StatusCodes.BAD_REQUEST);
        }

        const accessToken = await Auth.generateJWTToken(
            { _id: user._id, email: user.email, fullName: user.fullName },
            "access"
        );
        const refreshToken = await Auth.generateJWTToken(
            { _id: user._id },
            "refresh"
        );

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );

        return { user: { updatedUser, accessToken } };
    } catch (error) {
        console.log(error);
        if (error.statusCode == StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "Error Occured while Logging in the User.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function verifyJWT(data) {
    const user = await userRepository.getUserById(data._id);
    if (!user) {
        throw new AppError("Invalid JWT Token", StatusCodes.BAD_REQUEST);
    }
    return user;
}

async function logout(id) {
    try {
        const response = await userRepository.update(id);
        return response;
    } catch (error) {
        console.log(error);
        throw new AppError(
            "Error Occured while Logging out the User.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    signUp,
    login,
    verifyJWT,
    logout,
};
