const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

async function validateSignUpIncomingRequest(req, res, next) {
    if (!req.body.fullName) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError(
                        "Full Name is required.",
                        StatusCodes.BAD_REQUEST
                    )
                )
            );
    }
    if (!req.body.email) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError("Email is required.", StatusCodes.BAD_REQUEST)
                )
            );
    }
    if (!req.body.password) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError(
                        "Password is required.",
                        StatusCodes.BAD_REQUEST
                    )
                )
            );
    }
    if (!req.file.path) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError("Avatar is required.", StatusCodes.BAD_REQUEST)
                )
            );
    }
    next();
}

async function validateLoginIncomingRequest(req, res, next) {
    if (!req.body.email) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError("Email is required.", StatusCodes.BAD_REQUEST)
                )
            );
    }
    if (!req.body.password) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError(
                        "Password is required.",
                        StatusCodes.BAD_REQUEST
                    )
                )
            );
    }
    next();
}

module.exports = {
    validateSignUpIncomingRequest,
    validateLoginIncomingRequest,
};
