const express = require('express');

const topicsRouter = express.Router();
const { getTopics, addTopics, getArticlesByTopic } = require('../controllers/topics');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(addTopics);

topicsRouter.route('/:topics/articles').get(getArticlesByTopic);

module.exports = topicsRouter;
