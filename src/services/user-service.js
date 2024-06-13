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

        return { user: { updatedUser, accessToken, refreshToken } };
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
        const response = await userRepository.updateRefreshToken(id, null);
        return response;
    } catch (error) {
        console.log(error);
        throw new AppError(
            "Error Occured while Logging out the User.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function refreshAccessToken(token) {
    try {
        const decode = await Auth.decodeToken(token, "refresh");
        const user = await userRepository.getUserById(decode._id);
        if (!user) {
            throw new AppError("Invalid JWT Token", StatusCodes.BAD_REQUEST);
        }
        if (token !== user.refreshToken) {
            throw new AppError(
                "Refresh Token Expired or Used.",
                StatusCodes.UNAUTHORIZED
            );
        }

        const accessToken = await Auth.generateJWTToken(
            { _id: user._id, email: user.email, fullName: user.fullName },
            "access"
        );
        const refreshToken = await Auth.generateJWTToken(
            { _id: user._id },
            "refresh"
        );
        await userRepository.updateRefreshToken(user._id, refreshToken);

        return { tokens: { refreshToken, accessToken } };
    } catch (error) {
        if (error.statusCode == StatusCodes.UNAUTHORIZED) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "Error Occured while Refreshing Token",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function changePassword(data) {
    try {
        if (data.newPassword !== data.confirmNewPassword) {
            throw new AppError(
                "New Password and Confirm New Password doesn't match.",
                StatusCodes.BAD_REQUEST
            );
        }

        const existingUser = await userRepository.getUserById(data.user._id);
        if (!existingUser) {
            throw new AppError(
                "User corresponding to the given id doesn't exists.",
                StatusCodes.NOT_FOUND
            );
        }

        const isPasswordCorrect = await existingUser.checkPassword(
            data.oldPassword
        );
        if (!isPasswordCorrect) {
            throw new AppError("Invalid Credentials", StatusCodes.BAD_REQUEST);
        }
        const updatedUser = await userRepository.updatePassword(
            data.user,
            data.newPassword
        );
        return updatedUser;
    } catch (error) {
        if (error.statusCode == StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "Error Occured while Changing Password.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    signUp,
    login,
    verifyJWT,
    logout,
    refreshAccessToken,
    changePassword,
};
