const knex = require("../../database");
const jwt = require("jsonwebtoken");
const { key } = require("../../config/jwb.json");

exports.getUserFromToken = async (req) => {

    const { authorization = null } = req.headers;

  

    let token = authorization, user;

    if (token === null || token === undefined) {
        token = req.cookies.token;
    }

    if (token === null || token === undefined) {
        return [];
    }


    const { user_id } = jwt.verify(token, key);

    user = await knex("user_information")
        .where({ user_id });

    return user;

}