const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/public"));
app.use(cookieParser());
app.use(
    cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);

module.exports = app;
