const express = require('express');
const {
  getArticles,
  getArticlesByArticleID,
  updateVotes,
  getCommentsByArticle_id,
} = require('../controllers/articles');

const articlesRouter = express.Router();

articlesRouter.route('/').get(getArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticlesByArticleID)
  .patch(updateVotes);

articlesRouter.route('/:article_id/comments').get(getCommentsByArticle_id);

articlesRouter.route('/:article_id/comments/:comments_id');

module.exports = articlesRouter;
