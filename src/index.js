const app = require("./app");
const connectDB = require("./db");
const { Logger, ServerConfig } = require("./config");

connectDB()
    .then(() => {
        app.listen(ServerConfig.PORT, () => {
            console.log(`Server Started at PORT:- ${ServerConfig.PORT}`);
            Logger.info("Server Booted Up Successfully!");
        });
    })
    .catch((error) => {
        console.log(`MongoDB Connection Failed !! Error:- ${error}`);
        process.exit(1);
    });
