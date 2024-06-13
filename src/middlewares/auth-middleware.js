const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, Auth } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { UserService } = require("../services");

async function verifyJWT(req, res, next) {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(
                    new ErrorResponse(
                        new AppError(
                            "Unauthorized Request",
                            StatusCodes.UNAUTHORIZED
                        )
                    )
                );
        }

        const decode = await Auth.decodeToken(token, "access");
        const user = await UserService.verifyJWT(decode);
        req.user = user;
        next();
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        "Something went wrong while verifying JWT Token",
                        StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

// Gets refreshToken and pass the token to the request.
async function verifyRefreshToken(req, res, next) {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(
                new ErrorResponse(
                    new AppError(
                        "Unauthorized Request",
                        StatusCodes.UNAUTHORIZED
                    )
                )
            );
    }
    req.token = incomingRefreshToken;
    next();
}

module.exports = {
    verifyJWT,
    verifyRefreshToken,
};
