const connection = require('../connection');

exports.fetchArticles = () => connection
  .select('*')
  .from('articles')
  .returning('*');
