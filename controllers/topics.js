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
      if (topics.length === 0) return Promise.reject({ status: 404, message: 'page not found' });

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
  const { topic } = req.params;

  const { limit, p, order } = req.query;

  let { sort_by } = req.query;

  const validSorts = ['title', 'article_id', 'votes', 'author', 'created_at', 'topic'];

  if (!validSorts.includes(sort_by)) sort_by = 'created_at';

  Promise.all([
    countArticlesByTopic(req.params),
    fetchArticlesByTopic(topic, sort_by, limit, p, order),
  ])
    .then(([total_count, articles]) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, message: 'article not found' });
      }
      return res.status(200).send({ total_count, articles });
    })
    .catch(next);
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
