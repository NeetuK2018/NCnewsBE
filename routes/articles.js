const express = require('express');
const {
  getArticles,
  getArticlesByArticleID,
  updateVotes,
  getCommentsByArticle_id,
  addCommentByArticle_id,
  updateCommentVote,
  deleteArticleByArticle_id,
  deleteComment,
} = require('../controllers/articles');
const { handle405 } = require('../errors/error');

const articlesRouter = express.Router();

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(getArticlesByArticleID)
  .patch(updateVotes)
  .delete(deleteArticleByArticle_id)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticle_id)
  .post(addCommentByArticle_id)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments/:comment_id')
  .patch(updateCommentVote)
  .delete(deleteComment)
  .all(handle405);

module.exports = articlesRouter;
