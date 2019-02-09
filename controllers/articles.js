const {
  fetchArticles,
  fetchArticlesByArticleID,
  modifyVotes,
  countArticles,
  fetchCommentsByArticle_id,
  removeArticle,
  addComment,
  changingVote,
  removeComment,
} = require('../db/models/articles');

exports.getArticles = (req, res, next) => {
  const {
    sort_by, order, p: pageRef, limit: maxResults,
  } = req.query;

  Promise.all([fetchArticles(maxResults, sort_by, order, pageRef), countArticles()])
    .then(([articles, total_count]) => {
      if (articles.length === 0) return Promise.reject({ status: 404, message: 'articles not found' });

      res.status(200).send({ articles, total_count: total_count[0].total_count });
    })
    .catch(err => next(err));
};

exports.getArticlesByArticleID = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticlesByArticleID(article_id)
    .then(([article]) => {
      if (article) {
        res.send({ article });
      } else next({ status: 404, message: 'article_id does not exist' });
    })
    .catch(next);
};

exports.updateVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (Number.isNaN(parseInt(inc_votes, 10))) return next({ status: 400, msg: 'invalid inc_votes' });
  modifyVotes(article_id, inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};

exports.getCommentsByArticle_id = (req, res, next) => {
  const { article_id } = req.params;

  const {
    limit, sort_by, p, order,
  } = req.query;
  fetchCommentsByArticle_id(article_id, limit, sort_by, p, order)
    .then((comments) => {
      if (comments.length === 0) return Promise.reject({ status: 404, message: 'article ID does not exist' });

      res.status(200).send({ comments });
    })
    .catch(err => next(err));
};

exports.deleteArticleByArticle_id = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then((response) => {
      if (response === 0) next({ status: 404, message: 'no articles to delete' });
      else res.status(204).send({ message: 'delete successful' });
    })
    .catch(next);
};

exports.addCommentByArticle_id = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  const newComment = { username, body, article_id };
  addComment(newComment)
    .then(([comment]) => {
      res.status(201).json({ comment });
    })
    .catch(err => next(err));
};

exports.updateCommentVote = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id, comments_id } = req.params;

  if (Number.isNaN(parseInt(inc_votes, 10))) return next({ status: 400, msg: 'invalid inc_votes' });
  changingVote(article_id, comments_id, inc_votes)
    .then(([comment]) => {
      // console.log('hiyaz', comment);
      res.status(200).json({ comment });
    })
    .catch(err => next(err));
};

exports.deleteComment = (req, res, next) => {
  const { article_id, comments_id } = req.params;
  // console.log(article_id);
  removeComment(article_id, comments_id)
    .then((response) => {
      // console.log('response', response);
      if (response === 0) next({ status: 404, msg: 'no data for this endpoint...' });
      else res.status(204).send({ message: 'delete successful' });
    })
    .catch(next);
};
