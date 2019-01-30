const connection = require('../connection');

exports.fetchTopics = () => connection
  .select('*')
  .from('topics')
  .join('articles', 'topics.slug', '=', 'articles.topic')
  .returning('*');

exports.postingTopics = newTopic => connection
  .insert(newTopic)
  .into('topics')
  .returning('*');

exports.fetchArticlesByTopic = () => connection
  .select('articles.*')
  .count('comments.comments_id AS comment_count')
  .from('articles')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .groupBy('articles.article_id')
  .returning('*');
