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
  describe('api/topics', () => {
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
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      }));
    it('GET status: 200 responds sorted by comment_count DEFAULT CASE', () => request
      .get('/api/topics/mitch/articles?sorted_by=Comment_count')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].Comment_count).to.equal('13');
      }));
    it('GET status:200 responds with p at 1 with limit of 10 DEFAULT CASE', () => request
      .get('/api/topics/mitch/articles?p=1')
      .expect(200)
      .then(({ body }) => {
        // console.log('pages', body.articles);
        expect(body.articles).to.have.length(10);
      }));
    it('GET status:200 responds with p at 2 with limit of 10', () => request
      .get('/api/topics/mitch/articles?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(1);
      }));
    it('GET status:200 responds with a total_count', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log('pages', body.total_count);
        expect(body.total_count[0].total_count).to.have.equal('11');
      }));
    it('POST status: 201 it inserts a new article into article table', () => request
      .post('/api/topics/mitch/articles')
      .send({
        title: 'crazylass in tech',
        body: 'I will be supercoder',
        author: 'icellusedkars',
      })
      .expect(201)
      .then(({ body }) => {
        // console.log('hiya', body);
        expect(body.article).to.be.an('object');
        expect(body.article).to.contains.keys(
          'article_id',
          'author',
          'body',
          'created_at',
          'title',
          'topic',
          'votes',
        );
        expect(body.article.title).to.equal('crazylass in tech');
      }));
    describe('/articles', () => {
      it('GET status:200 responds with an array of topic objects', () => request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.contains.keys('title', 'article_id');
        }));
      it('GET status: 200 responds with the correct number of articles', () => request
        .get('/api/articles?limit=15')
        .expect(200)
        .then(({ body }) => {
          // console.log('articles!!!!!', body.articles);
          expect(body.articles).to.have.length(12);
        }));
      it('GET status: 200 each article has all correct columns', () => request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
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
      it('GET status: 200 each articles responds with a limit of 10 results DEFAULT CASE', () => request
        .get('/api/articles?limit=10')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
        }));
      it('GET status: 200 each articles responds with a limit of 6 results when ', () => request
        .get('/api/articles?limit=6')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(6);
        }));
      it('GET status: 200 each topics responds sorted by date DEFAULT CASE', () => request
        .get('/api/articles?sorted_by')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
        }));
      it('GET status: 200 responds sorted by comment_count DEFAULT CASE', () => request
        .get('/api/articles?sorted_by=Comment_count')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].Comment_count).to.equal('13');
        }));
      it('GET status:200 responds with p at 1 with limit of 10 DEFAULT CASE', () => request
        .get('/api/articles?p=1')
        .expect(200)
        .then(({ body }) => {
          // console.log('pages', body.articles);
          expect(body.articles).to.have.length(10);
        }));
      it('GET status:200 responds with p at 2 with limit of 10', () => request
        .get('/api/articles?p=2')
        .expect(200)
        .then(({ body }) => {
          // console.log(body.articles);
          expect(body.articles).to.have.length(2);
        }));
      describe('/articles/:article_id', () => {
        it('GET status:200 responds with an article object', () => request
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            // console.log('hiyia', body.article);
            expect(body.article).to.be.an('object');
            expect(body.article).to.contains.keys(
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
        it('PATCH status: 200 can change the votes property', () => request
          .patch('/api/articles/1')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            // console.log(body.article);
            expect(body.article.votes).to.equal(101);
          }));
        it('PATCH status: 200 can change the votes property', () => request
          .patch('/api/articles/1')
          .send({ inc_votes: -2 })
          .expect(200)
          .then(({ body }) => {
            // console.log(body.article);
            expect(body.article.votes).to.equal(98);
          }));
        xit('PATCH status: 400 when an integer is not passed', () => request
          .patch('/api/articles/1')
          .send({ inc_votes: 'bbbb' })
          .expect(400)
          .then(({ body }) => {
            console.log('HELOOOO', body);
            expect(body.message).to.equal('votes must be a number!');
          }));
        it('GET status:200 responds with an array of comments for given article id', () => request
          .get('/api/articles/5/comments')
          .expect(200)
          .then(({ body }) => {
            console.log('commenting', body);
            expect(body.articles).to.have.length(2);
          }));
      });
    });
  });
});
