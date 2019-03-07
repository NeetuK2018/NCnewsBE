const getArticlesByTopic = function (req, res, next) {
  fetchArticlesByTopic(req.params, req.query)
    .then(([topic, articles, countData]) => {
      // all good, we have articles
      if (articles.length !== 0) {
        const { total_count } = countData[0];
        return res.status(200).send({ total_count, articles });
      }
      // topic exists, but no articles for it
      if (topic[0]) {
        return res.status(200).send({ total_count: 0, articles });
      }
      // topic exists, there are articles, but pagination went too far back
      if (countData[0]) {
        const { total_count } = countData[0];
        return res.status(200).send({ total_count, articles: [] });
      }
      // else
      return Promise.reject({ status: 404, message: 'articles not found' });
    })
    .catch(next);
};
