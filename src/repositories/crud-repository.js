class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    async getUserById(id) {
        const response = await this.model.findById(id);
        return response;
    }
}

module.exports = CrudRepository;
