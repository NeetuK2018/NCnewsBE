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

exports.countArticlesByUsername = ({ username }) => connection
  .select('username')
  .count({ total_count: 'username' })
  .from('articles')
  .leftJoin('users', 'users.username', '=', 'articles.author')
  .groupBy('username')
  .where('articles.author', '=', username);

exports.fetchArticlesByUsername = (
  username,
  limit = 10,
  sort_by = 'created_at',
  p = 1,
  order = 'DESC',
) => connection
  .select(
    'articles.author',
    'articles.title',
    'articles.article_id',
    'articles.votes',
    'articles.created_at',
    'articles.topic',
  )
  .count('comments.article_id AS comment_count')
  .from('articles')
  .leftJoin('comments', 'articles.article_id', 'comments.article_id')
  .where('articles.author', '=', username)
  .groupBy('articles.author', 'articles.title', 'articles.article_id')
  .offset((p - 1) * limit)
  .orderBy(sort_by, order)
  .limit(limit);
