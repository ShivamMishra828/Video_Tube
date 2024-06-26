const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/common");

async function signUp(req, res) {
    try {
        const user = await UserService.signUp({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            avatar: req.file.path,
        });
        return res
            .status(StatusCodes.CREATED)
            .json(new SuccessResponse(user, "User created successfully."));
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

async function login(req, res) {
    try {
        const { user } = await UserService.login({
            email: req.body.email,
            password: req.body.password,
        });
        return res
            .cookie("accessToken", user.accessToken, {
                secure: true,
                httpOnly: true,
            })
            .cookie("refreshToken", user.refreshToken, {
                secure: true,
                httpOnly: true,
            })
            .status(StatusCodes.OK)
            .json(new SuccessResponse(user, "User Logged in successfully."));
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

async function logout(req, res) {
    try {
        const { _id } = req.user;
        const response = await UserService.logout(_id);
        return res
            .status(StatusCodes.OK)
            .clearCookie("accessToken", {
                httpOnly: true,
                secure: true,
            })
            .clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
            })
            .json(new SuccessResponse(response, "Logged out successfully."));
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

async function refreshAccessToken(req, res) {
    try {
        const token = req.token;
        const { tokens } = await UserService.refreshAccessToken(token);
        return res
            .status(StatusCodes.OK)
            .cookie("accessToken", tokens.accessToken, {
                httpOnly: true,
                secure: true,
            })
            .cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: true,
            })
            .json(
                new SuccessResponse(tokens.refreshToken, "Token Refreshed!!")
            );
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

async function changePassword(req, res) {
    try {
        const response = await UserService.changePassword({
            oldPassword: req.body.oldPassword,
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirmNewPassword,
            user: req.user,
        });
        return res
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(response, "Password changed successfully!!")
            );
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

module.exports = {
    signUp,
    login,
    logout,
    refreshAccessToken,
    changePassword,
};
