const connection = require('../connection');

exports.fetchUsers = () => connection.returning('*');

exports.updateUsers = () => connection.returning('*');

exports.fetchUsername = () => connection.returning('*');

exports.fetchArticlesByUsername = () => connection.returning('*');

exports.countArticlesByUsername = () => connection.returning('*');,
