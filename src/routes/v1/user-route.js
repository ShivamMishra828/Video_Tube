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

module.exports = router;
