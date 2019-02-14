const connection = require('../connection');

exports.fetchArticles = (limit = 10, sort_by = 'created_at', p = 1, order = 'DESC') => connection
  .select('articles.*')
  .count('comments.comment_id AS comment_count')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .from('articles')
  .groupBy('articles.article_id')
  .returning('*')
  .limit(limit)
  .orderBy(sort_by, order)
  .offset((p - 1) * limit);

exports.fetchArticlesByArticleID = article_id => connection
  .select('articles.*')
  .count('comments.comment_id AS comment_count')
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
  sort_by = 'created_at',
  limit = 10,
  p = 1,
  order = 'DESC',
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

exports.changingVote = (article_id, comment_id, inc_votes) => connection
  .select('*')
  .from('comments')
  .where({ article_id })
  .where({ comment_id })
  .increment('votes', inc_votes)
  .returning('*');

exports.removeComment = (article_id, comment_id) => connection('comments')
  .where({ 'comments.article_id': article_id })
  .where({ 'comments.comment_id': comment_id })
  .del();
