exports.deleteComment = (req, res, next) => {
  const { article_id, comment_id } = req.params;

  removeComment(article_id, comment_id)
    .then((response) => {
      if (response === 0) next({ status: 404, message: 'no data for this endpoint...' });
      else res.status(204).send();
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { article_id, comment_id } = req.params;

  removeComment(article_id, comment_id)
    .then((response) => {
      if (response === 0) next({ status: 404, message: 'sorry not found' });
      else res.status(204).send();
    })
    .catch(next);
};
