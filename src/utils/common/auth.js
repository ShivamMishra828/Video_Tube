const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");

async function generateJWTToken(payload, type) {
    if (type == "access") {
        return await jwt.sign(payload, ServerConfig.ACCESS_TOKEN_SECRET, {
            expiresIn: ServerConfig.ACCESS_TOKEN_EXPIRY,
        });
    } else {
        return await jwt.sign(payload, ServerConfig.REFRESH_TOKEN_SECRET, {
            expiresIn: ServerConfig.REFRESH_TOKEN_EXPIRY,
        });
    }
}

module.exports = {
    generateJWTToken,
};
