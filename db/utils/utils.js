exports.formatArticles = (data) => {
  const formattedArticles = data.map(({ created_by, created_at, ...other }) => ({
    // pull out created by an created at and putt the rest in
    ...other, // others
    author: created_by, // then map through for username to equal created_by
    created_at: new Date(created_at),
  }));
  return formattedArticles;
};

exports.articleRef = articles => articles.reduce((articleObj, articleCurr) => {
  articleObj[articleCurr.title] = articleCurr.article_id;
  return articleObj;
}, {});

exports.formatComments = (data, articleRef) => {
  const formattedComments = data.map(({
    created_at, created_by, belongs_to, ...other
  }) => ({
    ...other,
    username: created_by,
    created_at: new Date(created_at),
    article_id: articleRef[belongs_to],
  }));
  return formattedComments;
};
