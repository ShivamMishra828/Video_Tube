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

async function decodeToken(token, type) {
    if (type == "access") {
        return await jwt.verify(token, ServerConfig.ACCESS_TOKEN_SECRET);
    } else {
        return await jwt.verify(token, ServerConfig.REFRESH_TOKEN_SECRET);
    }
}

module.exports = {
    generateJWTToken,
    decodeToken,
};
