const {
  fetchUsers,
  updateUsers,
  fetchUsername,
  fetchArticlesByUsername,
  countArticlesByUsername,
} = require('../db/models/users');

exports.getUsers = (req, res, next) => {
  fetchUsers();
};

exports.addUsers = (req, res, next) => {
  updateUsers();
};

exports.getUserByUsername = (req, res, next) => {
  fetchUsername();
};

exports.getArticlesByUsername = (req, res, next) => {
  fetchArticlesByUsername();
  countArticlesByUsername();
};
