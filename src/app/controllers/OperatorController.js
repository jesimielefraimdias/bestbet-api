const knex = require("../../database");
const bcrypt = require("bcryptjs");
const mailer = require("../../services/mailer");
const { environment } = require("../../config/environment");
const { key, emailKey } = require("../../config/jwb.json");
const path = require("path");
const { getUserFromToken } = require("../helpers/userToken");

//CTR + K + 2
module.exports = {

    async setViewed(req, res, next) {

        try {

            const { evaluationId, viewed } = req.body;


            await knex('evaluation_information')
                .where({ evaluation_id: evaluationId })
                .update({
                    viewed: viewed,
                });

            res.status(204).end();

        } catch (error) {
            next(error);
        }
    },

    logged(req, res, next) {
        res.status(200).json({ accessLevel: res.locals.accessLevel });
    }
}