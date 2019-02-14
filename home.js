const endPoints = {
  '/api/topics': 'Lists all Topics',
  '/api/topics/:topic/articles': 'Lists Articles for Selected Topic',
  '/api/articles': 'Lists All Articles',
  '/api/articles/:article_id': 'Displays Article by Article ID',
  '/api/articles/:article_id/comments': 'Lists all the Comments by Article ID',
  '/api/articles/:article_id/comments/:comment_id':
    'Displays Comment by selected ID for selected Article ID',
  '/api/users': 'Lists all Users',
  '/api/users/:username': 'Displays User details for selected Username',
  '/api/users/:username/articles': 'Lists all the Articles by selected Username',
};

module.exports = { endPoints };
