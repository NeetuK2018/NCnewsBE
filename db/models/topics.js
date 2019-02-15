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
  sort_by = 'created_at',
  limit = 10,
  p = 1,
  order = 'DESC',
) => connection
  .select('articles.*')
  .count('comments.comment_id AS comment_count')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .from('articles')
  .groupBy('articles.article_id')
  .where({ topic: chooseTopic })
  .returning('*')
  .limit(limit)
  .orderBy(sort_by, order)
  .offset((p - 1) * limit);

exports.countArticlesByTopic = ({ topic }) => connection
  .count('articles.title as total_count')
  .from('articles')
  .where({ topic })
  .returning('*')
  .then(([{ total_count }]) => total_count);

exports.postingArticles = newArticle => connection
  .insert(newArticle)
  .into('articles')
  .returning('*');
