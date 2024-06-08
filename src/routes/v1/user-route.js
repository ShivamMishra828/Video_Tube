const express = require("express");
const { UserController } = require("../../controllers");
const { Multer, UserMiddleware } = require("../../middlewares");

const router = express.Router();

router.post(
    "/signup",
    Multer.upload.single("avatar"),
    UserMiddleware.validateIncomingRequest,
    UserController.signUp
);

module.exports = router;
