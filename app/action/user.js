const User = require('../model/user');

const createUser = async (data) => {
    try {
       const result = await User.create(data); 
       return result;
    } catch (error) {
        const message = error.message || error
        throw message;
    }
}

const getUserById = async (id) => {
    try {
        const result = await User.findById(id);
        return result;
    } catch (error) {
        const message = error.message || error
        throw message;
    }
}

const updateUserById = async (id, data) => {
    try {
        const result = await User.findOneAndUpdate({ id }, { $set: data }, { new: true });
        return result;
    } catch (error) {
        const message = error.message || error
        throw message;
    }
}
