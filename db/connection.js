const knex = require("knex");
const dbConfig = require("../knexfile");

const connection = knex(dbConfig);
console.log("connection", connection);

module.exports = connection;
