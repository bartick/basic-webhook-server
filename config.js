require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const SECRET_ID = process.env.SECRET_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SCOPES = process.env.SCOPES;

module.exports = {
    CLIENT_ID,
    SECRET_ID,
    REDIRECT_URI,
    SCOPES
};