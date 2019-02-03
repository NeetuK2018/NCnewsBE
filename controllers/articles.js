const {
  fetchArticles,
  fetchArticlesByArticleID,
  modifyVotes,
  countArticles,
  fetchCommentsByArticle_id,
  removeArticle,
  addComment,
} = require('../db/models/articles');

exports.getArticles = (req, res, next) => {
  const {
    sort_by, order, p: pageRef, limit: maxResults,
  } = req.query;

  Promise.all([fetchArticles(maxResults, sort_by, order, pageRef), countArticles()])
    .then(([articles, total_count]) => {
      if (!articles) return Promise.reject({ status: 404, message: 'articles not found' });

      res.status(200).send({ articles, total_count });
    })
    .catch(err => next(err));
};

exports.getArticlesByArticleID = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticlesByArticleID(article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};

exports.updateVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  // console.log(/\d/g.test(inc_votes), inc_votes);
  if (/\d/g.test(inc_votes)) {
    modifyVotes(article_id, inc_votes)
      .then(([article]) => {
        res.status(200).send({ article });
      })
      .catch(err => console.log(err) || next(err));
  } else {
    next({ status: 404, message: 'vote must be an integer' });
  }
};

exports.getCommentsByArticle_id = (req, res, next) => {
  const { article_id } = req.params;

  const {
    limit, sort_by, p, order,
  } = req.query;

  fetchCommentsByArticle_id(article_id, limit, sort_by, p, order)
    .then((comments) => {
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
    .catch(err => console.log(err) || next(err));
};
