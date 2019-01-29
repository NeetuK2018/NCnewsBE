const { fetchTopics } = require('../db/models/topics');

exports.getTopics = (req, res, next) => {
  fetchTopics();
};
