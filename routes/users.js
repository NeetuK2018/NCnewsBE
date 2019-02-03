const express = require('express');

const usersRouter = express.Router();
const {
  getUsers,
  addUser,
  getUserByUsername,
  getArticlesbyUsername,
} = require('../controllers/users');

usersRouter
  .route('/')
  .get(getUsers)
  .post(addUser);

usersRouter.route('/:username').get(getUserByUsername);

usersRouter.route('/:username/articles').get(getArticlesbyUsername);

module.exports = usersRouter;
