const express = require('express');
const { handle405 } = require('../errors/error');

const topicsRouter = express.Router();
const {
  getTopics, addTopics, getArticlesByTopic, addArticle,
} = require('../controllers/topics');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(addTopics)
  .all(handle405);

topicsRouter
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(addArticle)
  .all(handle405);

module.exports = topicsRouter;
