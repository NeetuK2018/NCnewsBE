const express = require('express');

const topicsRouter = express.Router();
const {
  getTopics, addTopics, getArticlesByTopic, addArticle,
} = require('../controllers/topics');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(addTopics);

topicsRouter
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(addArticle);

module.exports = topicsRouter;
