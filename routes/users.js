const express = require('express');

const usersRouter = express.Router();
const {
  getUsers,
  addUser,
  getUserByUsername,
  getArticlesByUsername,
} = require('../controllers/users');

usersRouter
  .route('/')
  .get(getUsers)
  .post(addUser);

usersRouter.route('/:username').get(getUserByUsername);

// usersRouter.route('/:username/articles').get(getArticlesByUsername);

module.exports = usersRouter;
