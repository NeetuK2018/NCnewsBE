const express = require('express');

const usersRouter = express.Router();

usersRouter.route('/');

usersRouter.route('/:userName');

usersRouter.route('/:userName/articles');

module.exports = usersRouter;
