process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const connection = require('../db/connection');

describe('/api', () => {
  after(() => connection.destroy());
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());
  describe('/topics', () => {
    it('GET status:200 responds with an array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        // console.log({ body });
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).to.contains.keys('slug', 'description');
      }));
  });
  it('POST status: 201 it inserts a new topic into topic table', () => request
    .post('/api/topics')
    .send({
      slug: 'Netflix',
      description: 'too much content not enough time..',
    })
    .expect(201)
    .then(({ body }) => {
      expect(body.topic).to.be.an('object');
    }));
});
