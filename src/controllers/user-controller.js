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
        const { user, accessToken } = await UserService.login({
            email: req.body.email,
            password: req.body.password,
        });
        return res
            .cookie("accessToken", accessToken, {
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

module.exports = {
    signUp,
    login,
};
