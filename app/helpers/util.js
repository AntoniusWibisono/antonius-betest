const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWTSECRET = 'jwt-jenius-12345'
const saltRounds = 10;

const encryptPass = (pass) => {
    return bcrypt.hashSync(pass, saltRounds);
}

const comparePass = (inputPass, storedPass) => {
    return bcrypt.compareSync(inputPass, storedPass);
}

const jwtSign = (payload) => {
    return jwt.sign(payload, JWTSECRET, { expiresIn: '1h' });
}

const jwtVerify = (payload) => {
    return jwt.verify(payload, JWTSECRET);
}

module.exports = {
    encryptPass, comparePass, jwtSign, jwtVerify
}