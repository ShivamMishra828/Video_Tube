const express = require("express");
const { UserController } = require("../../controllers");
const { Multer, UserMiddleware, AuthMiddleware } = require("../../middlewares");

const router = express.Router();

router.post(
    "/signup",
    Multer.upload.single("avatar"),
    UserMiddleware.validateSignUpIncomingRequest,
    UserController.signUp
);

router.post(
    "/login",
    UserMiddleware.validateLoginIncomingRequest,
    UserController.login
);

router.get("/logout", AuthMiddleware.verifyJWT, UserController.logout);
router.post(
    "/refresh-token",
    AuthMiddleware.verifyRefreshToken,
    UserController.refreshAccessToken
);
router.post(
    "/change-password",
    AuthMiddleware.verifyJWT,
    UserController.changePassword
);

module.exports = router;
