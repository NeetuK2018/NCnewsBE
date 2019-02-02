const {
  fetchUsers,
  updateUsers,
  fetchUsername,
  fetchArticlesByUsername,
  countArticlesByUsername,
} = require('../db/models/users');

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(err => next(err));
};

exports.addUser = (req, res, next) => {
  const newUser = req.body;
  updateUsers(newUser)
    .then(([user]) => {
      res.status(201).json({ user });
    })
    .catch(err => console.log(err) || next(err));
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  fetchUsername(username)
    .then(([users]) => {
      res.status(200).send({ users });
    })
    .catch(err => next(err));
};

exports.getArticlesByUsername = (req, res, next) => {
  fetchArticlesByUsername();
  countArticlesByUsername();
};
