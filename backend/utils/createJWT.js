require('dotenv').config();
const JWT = require('jsonwebtoken');

module.exports = (res, payload) => {
    const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return token;
};
