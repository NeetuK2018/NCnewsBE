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
  sort_by = 'created_at',
  order = 'DESC',
  refPage = 1,
) => connection
  .select('articles.*')
  .count('comments.comments_id AS comment_count')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .from('articles')
  .groupBy('articles.article_id')
  .where({ topic: chooseTopic })
  .returning('*')
  .limit(maxResults)
  .orderBy(sort_by, order)
  .offset((refPage - 1) * maxResults);

exports.countArticlesByTopic = chooseTopic => connection
  .count('articles.title as total_count')
  .from('articles')
  .where({ topic: chooseTopic })
  .returning('*');

exports.postingArticles = newArticle => connection
  .insert(newArticle)
  .into('articles')
  .returning('*');
