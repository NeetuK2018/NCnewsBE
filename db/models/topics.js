const connection = require('../connection');

exports.fetchTopics = () => connection
  .select('*')
  .from('topics')
  .returning('*');

exports.postingTopics = (newTopic) => {
  console.log(newTopic);
  return connection
    .insert(newTopic)

    .into('topics')
    .returning('*');
};
