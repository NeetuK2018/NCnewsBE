const connection = require('../connection');

exports.fetchTopics = () => connection
  .select('*')
  .from('topics')
  .returning('*');

exports.postingTopics = newTopic => connection
  .insert(newTopic)
  .into('topics')
  .returning('*');

exports.fetchArticlesByTopic = (
  chooseTopic,
  maxResults = 10,
  sorted_By = 'created_at',
  order = 'DESC',
  refPage = 1,
) => connection
  .select('articles.*')
  .count('comments.comments_id AS Comment_count')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .from('articles')
  .groupBy('articles.article_id')
  .where({ topic: chooseTopic })
  .returning('*')
  .limit(maxResults)
  .orderBy(sorted_By, order)
  .offset((refPage - 1) * maxResults);
