const express = require('express');

const usersRouter = express.Router();
const {
  getUsers,
  addUser,
  getUserByUsername,
  getArticlesbyUsername,
} = require('../controllers/users');
const { handle405 } = require('../errors/error');

usersRouter
  .route('/')
  .get(getUsers)
  .post(addUser)
  .all(handle405);

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(handle405);

usersRouter
  .route('/:username/articles')
  .get(getArticlesbyUsername)
  .all(handle405);

module.exports = usersRouter;
