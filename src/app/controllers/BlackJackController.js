const knex = require("../../database");
const bcrypt = require("bcryptjs");
const mailer = require("../../services/mailer");
const { environment } = require("../../config/environment");
const { key, emailKey } = require("../../config/jwb.json");
const path = require("path");
const { getUserFromToken } = require("../helpers/userToken");

//CTR + K + 2
module.exports = {

    probabilidade(req, res, next) {
        const { entrada } = req.body;

        res.status(200).json({ sucesso: entrada });
    }

}