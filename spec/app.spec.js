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
        expect(body).to.be.an('object');
        expect(body.message).to.equal('page not found');
      }));
  });
  describe('api/topics', () => {
    it('GET status:200 responds with an array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
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
        expect(body.message).to.equal('invalid input, column does not exist');
      }));
  });
  describe('/topics/:topic/articles', () => {
    it('GET status:200 responds with an array of article objects', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0].topic).to.equal('mitch');
      }));
    it('GET status: 200 has the correct author of articles displayed', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)

      .then(({ body }) => {
        expect(body.articles[0].author).to.equal('butter_bridge');
      }));
    it('GET status: 200 each article has all correct columns', () => request
      .get('/api/topics/mitch/articles')
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
          expect(body.articles).to.have.length(10);
        }));
      it('GET status:200 responds with p at 2 with limit of 10', () => request
        .get('/api/articles?p=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(2);
        }));
      describe('/articles/:article_id', () => {
        it('GET status:200 responds with an article object', () => request
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
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
            expect(body.article.votes).to.equal(101);
          }));
        it('PATCH status: 200 can change the votes property', () => request
          .patch('/api/articles/1')
          .send({ inc_votes: -2 })
          .expect(200)
          .then(({ body }) => {
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
        xit('GET status:200 responds with an array of comments for given article id', () => request
          .get('/api/articles/5/comments')
          .expect(200)
          .then(({ body }) => {
            console.log('commenting', body);
            expect(body.articles).to.have.length(2);
          }));
      });
      describe('api/users', () => {
        it('GET status:200 responds with an array of users objects', () => request
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
            expect(body.users).to.be.an('array');
            expect(body.users[0]).to.contains.keys('username', 'name', 'avatar_url');
          }));
        it('GET status: 200 responds with the correct number of users', () => request
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
            expect(body.users).to.have.length(3);
          }));
        it('POST status: 201 it inserts a new user into users table', () => request
          .post('/api/users')
          .send({
            username: 'neetgurl',
            name: 'neetu',
            avatar_url:
                'https://www.codingWitch.com/wp-content/uploads/2019/01/recurssionPotion.jpg',
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.user).to.be.an('object');
            expect(body.user).to.contains.keys('username', 'username', 'avatar_url');
            expect(body.user.name).to.equal('neetu');
          }));
      });
      describe('/users/:username', () => {
        it('GET status:200 responds with an user object', () => request
          .get('/api/users/icellusedkars')
          .expect(200)
          .then(({ body }) => {
            expect(body.users).to.be.an('object');
            expect(body.users.username).to.equal('icellusedkars');
            expect(body.users).to.contains.keys('name', 'username', 'avatar_url');
          }));
      });
      describe('/users/:username/articles', () => {
        it('GET status: 200 responds with an articles array of article objects created by the given user', () => request
          .get('/api/users/icellusedkars/articles')
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.articles).to.have.length(10);
          }));
      });
    });
  });
});
