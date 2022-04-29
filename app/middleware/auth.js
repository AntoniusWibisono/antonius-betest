const { jwtVerify } = require('../helpers/util');

const validateAuth = (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) return res.status(403).json({message:'authorization not found'});
        const token = auth.split(' ')[1];
        const decoded = jwtVerify(token);
        const { userName, identityNumber } = decoded;
        req.user = {
            userName, identityNumber
        }
        next()
    } catch (error) {
        res.status(401).json({message:'unauthenticated user'});
    }
}


module.exports = { validateAuth };