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

// exports.fetchArticlesByUsername = () => connection.returning('*');

// exports.countArticlesByUsername = () => connection.returning('*');
