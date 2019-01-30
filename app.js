const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const { handle404, handle400 } = require('./errors/error');

app.use(bodyParser.json());

app.use('/api', apiRouter);
app.use('/*', (req, res, next) => {
  next({ status: 404, message: 'topics not found' });
});

// app.use((err, req, res, next) => {
//   console.log('errorrrrr', err);
//   res.status(500).send('server is broken');
// });

app.use(handle404);
app.use(handle400);

module.exports = app;
