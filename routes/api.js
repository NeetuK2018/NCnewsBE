const apiRouter = require('express').Router();

const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const usersRouter = require('./users');
const endPoints = require('../home');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.get('/', (req, res, next) => {
  res.status(200).send(endPoints);
});

module.exports = apiRouter;
