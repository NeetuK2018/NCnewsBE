const connection = require('../connection');

exports.fetchUsers = () => connection
  .select('*')
  .from('users')
  .returning('*');

exports.updateUsers = newUser => connection
  .insert(newUser)
  .into('users')
  .returning('*');

exports.fetchUsername = username => connection
  .select('users.*')
  .from('users')
  .where({ 'users.username': username })
  .returning('*');

exports.fetchArticlesByUsername = (
  username,
  maxResults = 10,
  sorted_By = 'created_at',
  order = 'DESC',
  p = 1,
) => connection
  .select('articles.*')
  .count('comments.article_id AS Comment_count')
  .from('articles')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .where('articles.author', '=', username)
  .groupBy('articles.author', 'articles.title', 'articles.article_id')
  .offset((p - 1) * maxResults)
  .orderBy(sorted_By, order)
  .limit(maxResults);

exports.countArticlesByUsername = ({ username }) => connection
  .select('username')
  .count({ total_count: 'username' })
  .from('articles')
  .leftJoin('users', 'users.username', '=', 'articles.author')
  .groupBy('username')
  .where('articles.author', '=', username);
