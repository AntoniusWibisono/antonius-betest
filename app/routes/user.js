const {
    createUser,
    getUserByQuery,
    updateUserById,
    deleteUserById
} = require('../action/user');
const { encryptPass, comparePass, jwtSign } = require('../helpers/util');
const { validateAuth } = require('../middleware/auth');

const loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const checkUser = await getUserByQuery({ userName });
        if (!checkUser) return res.status(404).json({
            message: 'user data not found'
        });
        const checkPassword = comparePass(password, checkUser.password);
        if (!checkPassword) return res.status(403).json({
            message: 'incorrect input'
        });
        const token = jwtSign({ 
            userName: checkUser.userName,
            identityNumber: checkUser.identityNumber,
        });
        return res.status(200).json({
            token
        })
    } catch (error) {
        return res.status(500).json(error);
    }
}

const registerUser = async (req,res) => {
    try {
        const result = await createUser(req.body);
        return res.status(201).json(result); 
    } catch (error) {
        return res.status(500).json(error);
    }
}

const findUserByQuery = async (req, res) => {
    try {
        const query = {};
        const { accountNumber, identityNumber } = req.query;
        if (accountNumber) query.accountNumber = accountNumber;
        if (identityNumber) query.identityNumber = identityNumber;
        
        const result = await getUserByQuery(query);

        if(!result) return res.status(404).json({
            message: 'user data not found'
        })
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateUserData = async (req, res) => {
    try {
        const { password } = req.body;
        const { id } = req.params;
        req.body.password = encryptPass(password);
        const checkData = await getUserByQuery({ identityNumber:id })
        if (!checkData) return res.status(404).json({
            message: 'user data not found'
        })
        const result = await updateUserById(checkData.id, req.body);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteUserData = async (req, res) => {
    try {
        const { id } = req.params;
        const checkData = await getUserByQuery({ identityNumber:id })
        if (!checkData) return res.status(404).json({
            message: 'user data not found'
        })
        const result = await deleteUserById(checkData.id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = (router) => {
    router.post('/', registerUser);
    router.post('/login', loginUser);
    router.use(validateAuth);
    router.get('/', findUserByQuery);
    router.put('/:id', updateUserData);
    router.delete('/:id', deleteUserData);
}