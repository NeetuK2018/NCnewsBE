exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ message: 'page not found' });
  else next(err);
};

exports.handle400 = (err, req, res, next) => {
  console.log(err);
  const { code } = err;
  const errorCodes400 = {
    42703: 'invalid input, column does not exist',
    23505: 'value already exists',
    23502: 'columns cannot be empty',
    23503: 'cannot post into non existent column',
    '22P02': 'invalid request type',
  };
  if (errorCodes400[code]) res.status(400).send({ message: errorCodes400[code] });
  else next(err);
};

exports.handle405 = (req, res) => {
  res.status(405).send({ message: 'method not allowed' });
};
