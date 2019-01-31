exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ message: 'page not found' });
  else next(err);
};

exports.handle400 = (err, req, res, next) => {
  // console.log(err);
  const { code } = err;
  const errorCodes400 = {
    42703: 'invalid input, column does not exist',
  };
  if (errorCodes400[code]) res.status(400).send({ message: errorCodes400[code] });
  else next(err);
};
