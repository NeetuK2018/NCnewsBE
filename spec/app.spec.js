process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const connection = require('../db/connection');

describe('/api', () => {
  after(() => connection.destroy());
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());
  describe('/*', () => {
    it('GET status:404 responds with page not found', () => request
      .get('/api/*')
      .expect(404)
      .then(({ body }) => {
        // console.log('hiyaxx', { body });
        expect(body).to.be.an('object');
        expect(body.message).to.equal('page not found');
      }));
  });
  describe('/topics', () => {
    it('GET status:200 responds with an array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        // console.log({ body });
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).to.contains.keys('slug', 'description');
      }));
    it('GET status: 200 responds with the correct number of topics', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.have.length(2);
      }));

    it('POST status: 201 it inserts a new topic into topic table', () => request
      .post('/api/topics')
      .send({
        slug: 'Netflix',
        description: 'too much content not enough time..',
      })
      .expect(201)
      .then(({ body }) => {
        // console.log('hiya', { body });
        expect(body.topic).to.be.an('object');
        expect(body.topic).to.contains.keys('slug', 'description');
        expect(body.topic.slug).to.equal('Netflix');
      }));
    it('POST status: 400 when incorrect format is posted', () => request
      .post('/api/topics')
      .send({
        netflix: 'too much content not enough time..',
      })
      .expect(400)
      .then(({ body }) => {
        // console.log(body.code);
        expect(body.message).to.equal('invalid input, column does not exist');
      }));
  });
  describe('/topics/:topic/articles', () => {
    it('GET status:200 responds with an array of article objects', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log('articles', body.articles[0]);
        expect(body.articles).to.be.an('array');
        expect(body.articles[0].topic).to.equal('mitch');
      }));
    it('GET status: 200 has the correct author of articles displayed', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)

      .then(({ body }) => {
        // console.log('articles', body.article[0]);
        expect(body.articles[0].author).to.equal('butter_bridge');
      }));
    it('GET status: 200 each article has all correct columns', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log('articles!!!!!', body.articles[0]);
        expect(body.articles[0]).to.contain.keys(
          'article_id',
          'title',
          'body',
          'votes',
          'topic',
          'author',
          'created_at',
          'Comment_count',
        );
      }));
    it('GET status: 200 each topics responds with a limit of 10 results DEFAULT CASE', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(10);
      }));
    it('GET status: 200 each topics responds with a limit of 6 results when ', () => request
      .get('/api/topics/mitch/articles?limit=6')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(6);
      }));
    it('GET status: 200 each topics responds sorted by date DEFAULT CASE', () => request
      .get('/api/topics/mitch/articles?sorted_by')
      .expect(200)
      .then(({ body }) => {
        // console.log('dates', body.articles);
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      }));
    it('GET status: 200 each topics responds sorted by comment_count DEFAULT CASE', () => request
      .get('/api/topics/mitch/articles?sorted_by=Comment_count')
      .expect(200)
      .then(({ body }) => {
        // console.log('dates', body.articles);
        expect(body.articles[0].Comment_count).to.equal('13');
      }));
  });
});
