const mongoose = require("mongoose");
const { ServerConfig } = require("../config");

async function connectDB() {
    try {
        const connectionInstance = await mongoose.connect(
            ServerConfig.MONGODB_URI
        );
        console.log(
            `MongoDB Connected !! Host:- ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log(
            `Something went wrong while Connecting to MongoDB:- ${error}`
        );
    }
}

module.exports = connectDB;
