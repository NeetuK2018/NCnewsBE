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
    .catch(err => next(err)); // .catch(err => console.log(err) || next(err));
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  // chnaged users to user
  fetchUsername(username)
    .then(([user]) => {
      if (user) {
        res.send({ user });
      } else next({ status: 404, message: 'username does not exist' });
    })
    .catch(next);
};
exports.getArticlesbyUsername = (req, res, next) => {
  const { username } = req.params;
  const {
    limit, sort_by, p, order,
  } = req.query;

  fetchArticlesByUsername(username, limit, sort_by, p, order)
    .then(articles => Promise.all([countArticlesByUsername(req.params), articles]))
    .then(([total_count, articles]) => {
      if (total_count.length === 0) return Promise.reject({ status: 404, message: 'user not found' });
      return res.status(200).send({ total_count: total_count[0].total_count, articles });
    })
    .catch(next);
};
