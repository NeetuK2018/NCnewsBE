const { fetchTopics, postingTopics, fetchArticlesByTopic } = require('../db/models/topics');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      if (!topics) return Promise.reject({ status: 404, message: 'topics not found' });

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
  const maxResults = req.query.limit;
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const pageRef = req.query.p;

  fetchArticlesByTopic(chooseTopic, maxResults, sort_by, order, pageRef)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(err => next(err));
};
