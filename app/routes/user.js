const {
  createUser,
  getUserByQuery,
  updateUserById,
  deleteUserById,
  getUserAuthByQuery
} = require('../action/user');
const { getAsync, setAsync } = require('../config/database');
const { encryptPass, comparePass, jwtSign } = require('../helpers/util');
const { validateAuth } = require('../middleware/auth');

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const checkUser = await getUserAuthByQuery({ userName });
    if (!checkUser) {
      return res.status(404).json({
        message: 'user data not found'
      });
    }

    const checkPassword = comparePass(password, checkUser.password);
    if (!checkPassword) {
      return res.status(403).json({
        message: 'incorrect input'
      });
    }
    const token = jwtSign({
      userName: checkUser.userName,
      identityNumber: checkUser.identityNumber
    });
    return res.status(200).json({
      token
    });
  }
  catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const result = await createUser(req.body);
    return res.status(201).json(result);
  }
  catch (error) {
    return res.status(500).json({
        message: error.message
      });
  }
};

const findUserByQuery = async (req, res) => {
  try {
    const query = {};
    const { accountNumber, identityNumber } = req.query;
    const key = `findUserByQuery-${accountNumber}-${identityNumber}`;

    const data = await getAsync(key);

    if (data) {
      return res.status(200).json({
        source: 'redis',
        result: JSON.parse(data)
      });
    }

    if (accountNumber) query.accountNumber = accountNumber;
    if (identityNumber) query.identityNumber = identityNumber;

    const result = await getUserByQuery(query);

    if (!result) {
      return res.status(404).json({
        message: 'user data not found'
      });
    }

    await setAsync(key, JSON.stringify(result), 'EX', '60');

    return res.status(200).json({
      source: 'database',
      result
    });
  }
  catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const updateUserData = async (req, res) => {
  try {
    const { password } = req.body;
    const { identityNumber } = req.params;
    
    const { identityNumber: userIdentityNumber } = req.user;
  
    if (identityNumber != userIdentityNumber ) {
        return res.status(403).json({
            message: 'user not authorized'
        })
    }
    req.body.password = encryptPass(password);
    const checkData = await getUserByQuery({ identityNumber });
    if (!checkData) {
      return res.status(404).json({
        message: 'user data not found'
      });
    }
    const result = await updateUserById(checkData.id, req.body);
    return res.status(200).json(result);
  }
  catch (error) {
    return res.status(500).json({
        message: error.message
      });
  }
};

const deleteUserData = async (req, res) => {
  try {
    const { identityNumber } = req.params;
    const checkData = await getUserByQuery({ identityNumber });
    if (!checkData) {
      return res.status(404).json({
        message: 'user data not found'
      });
    }
    const result = await deleteUserById(checkData.id);
    return res.status(200).json(result);
  }
  catch (error) {
    return res.status(500).json({
        message: error.message
      });
  }
};

module.exports = (router) => {
  router.post('/', registerUser);
  router.post('/login', loginUser);
  router.use(validateAuth);
  router.get('/', findUserByQuery);
  router.put('/:identityNumber', updateUserData);
  router.delete('/:identityNumber', deleteUserData);
};
