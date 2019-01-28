const knex = require("knex");
const dbConfig = require("../knexfile");

const connection = knex(dbconfig);
console.log("connection", connection);

module.exports = connection;
