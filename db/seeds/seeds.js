const {
  articleData,
  topicData,
  userData,
  commentData,
} = require('../data/index');
const {
  userRef,
  articleRef,
  formatArticles,
  formatComments,
} = require('../utils/utils');

exports.seed = (connection, Promise) => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection('users')
        .insert(userData)
        .returning('*'),)
    .then(() => connection('topics')
        .insert(topicData)
        .returning('*'),)
    .then((usersRows) => {
      const userLookup = userRef(usersRows);
      const formattedArticles = formatArticles(articleData, userLookup);
      return Promise.all([
        userLookup,
        connection('articles')
          .insert(formattedArticles)
          .returning('*'),
      ]);
    })
    .then(([userLookup, articleRows]) => {
      const articlesLookup = articleRef(articleRows);
      const formattedComms = formatComments(
        commentData,
        articlesLookup,
        userLookup,
      );
      return connection('comments')
        .insert(formattedComms)
        .returning('*');
    });
