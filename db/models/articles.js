const connection = require('../connection');

exports.fetchArticles = (maxResults = 10, sorted_By = 'created_at', order = 'DESC', refPage = 1) => connection
  .select('articles.*')
  .count('comments.comments_id AS Comment_count')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .from('articles')
  .groupBy('articles.article_id')
  .returning('*')
  .limit(maxResults)
  .orderBy(sorted_By, order)
  .offset((refPage - 1) * maxResults);

exports.fetchArticlesByArticleID = article_id => connection
  .select('articles.*')
  .count('comments.comments_id AS Comment_count')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .from('articles')
  .groupBy('articles.article_id')
  .where({ 'articles.article_id': article_id })
  .returning('*');

exports.modifyVotes = (article_id, inc_votes) => connection('articles')
  .where({ article_id })
  .increment('votes', inc_votes)
  .returning('*');

exports.countArticles = () => connection
  .count('articles.article_id as total_count')
  .from('articles')
  .returning('*');

exports.removeArticle = article_id => connection('articles')
  .where({ 'articles.article_id': article_id })
  .del();

exports.fetchCommentsByArticle_id = (
  article_id,
  limit = 10,
  sort_by = 'created_at',
  order = 'DESC',
  p = 1,
) => connection
  .select('*')
  .from('comments')
  .where({ article_id })
  .returning('*')
  .offset((p - 1) * limit)
  .orderBy(sort_by, order)
  .limit(limit);

exports.addComment = newComment => connection
  .insert(newComment)
  .into('comments')
  .returning('*');
