const { fetchTopics, postingTopics } = require('../db/models/topics');

exports.getTopics = (req, res, next) => {
  console.log('help');
  fetchTopics()
    .then((topics) => {
      if (!topics) return Promise.reject({ status: 404, message: 'topics not found' });
      // console.log(topics);
      res.status(200).send({ topics });
    })
    .catch(err => console.log(err) || next(err));
};

exports.addTopics = (req, res, next) => {
  const newTopic = req.body;

  postingTopics(newTopic)
    .then(([topic]) => {
      res.status(201).json({ topic });
    })
    .catch(err => console.log(err) || next(err));
};
