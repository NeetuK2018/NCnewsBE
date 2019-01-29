const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');

app.use(bodyParser.json());
app.use('/api', apiRouter);

// app.use(handle404);
// app.use(handle400);

module.exports = app;
