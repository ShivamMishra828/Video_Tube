const CrudRepository = require("./crud-repository");
const { User } = require("../models");

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async getUserByEmail(email) {
        const user = await User.findOne({ email });
        return user;
    }

    async updateRefreshToken(id, token) {
        const response = await User.findByIdAndUpdate(
            id,
            { $set: { refreshToken: token } },
            { new: true }
        ).select("_id email fullName");
        return response;
    }

    async updatePassword(user, password) {
        user.password = password;
        await user.save();
    }
}

module.exports = UserRepository;
