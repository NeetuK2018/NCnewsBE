const {
  fetchTopics,
  postingTopics,
  fetchArticlesByTopic,
  countArticlesByTopic,
  postingArticles,
} = require('../db/models/topics');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      // console.log(topics);
      if (topics.length === 0) return Promise.reject({ status: 404, message: 'topics not found' });

      res.status(200).send({ topics });
    })
    .catch(err => next(err));
};

exports.addTopics = (req, res, next) => {
  const newTopic = req.body;

  postingTopics(newTopic)
    .then(([topic]) => {
      res.status(201).json({ topic });
    })
    .catch(err => next(err));
};

exports.getArticlesByTopic = (req, res, next) => {
  const chooseTopic = req.params.topic;
  const {
    sort_by, order, p: pageRef, limit: maxResults,
  } = req.query;

  Promise.all([
    fetchArticlesByTopic(chooseTopic, maxResults, sort_by, order, pageRef),
    countArticlesByTopic(chooseTopic),
  ])
    .then(([articles, total_count]) => {
      if (articles.length === 0) return Promise.reject({ status: 404, message: 'Topic not Found' });
      res.status(200).send({ articles, total_count });
    })
    .catch(err => next(err));
};

exports.addArticle = (req, res, next) => {
  const { title, body, author } = req.body;
  const { topic } = req.params;
  // console.log('I am here');
  const newArticle = {
    title,
    body,
    author,
    topic,
  };
  // console.log(req.body);
  postingArticles(newArticle)
    .then(([article]) => {
      res.status(201).json({ article });
    })
    .catch(err => next(err));
};
