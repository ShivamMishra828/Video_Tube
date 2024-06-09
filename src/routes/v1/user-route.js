const express = require("express");
const { UserController } = require("../../controllers");
const { Multer, UserMiddleware } = require("../../middlewares");

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

module.exports = router;
