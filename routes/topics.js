const express = require('express');

const topicsRouter = express.Router();
const { getTopics, addTopics } = require('../controllers/topics');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(addTopics);

module.exports = topicsRouter;
