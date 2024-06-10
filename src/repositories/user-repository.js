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

    async update(id) {
        const response = await User.findByIdAndUpdate(
            id,
            { $set: { refreshToken: null } },
            { new: true }
        ).select("_id email fullName");
        return response;
    }
}

module.exports = UserRepository;
