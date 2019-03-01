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
    it('GET status: responds 404 when route not found ie not a topic/user/article route', () => request
      .get('/api/missing')
      .expect(404)
      .then(({ body }) => {
        // console.log("hi", body)
        expect(body).to.be.an('object');
        expect(body.message).to.equal('topics not found');
      }));
  });
  it('POST status 404 : responds 404 when trying to post in a new route', () => request.post('/api/*').expect(404));
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
    it('POST status: 400 when duplicte slug is posted', () => request
      .post('/api/topics')
      .send({
        slug: 'mitch',
        description: 'I love Hemp',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).to.equal('value already exists');
      }));
  });
  it('POST status: 400 when topic is posted without description', () => request
    .post('/api/topics')
    .send({
      slug: 'mitch',
    })
    .expect(400)
    .then(({ body }) => {
      expect(body.message).to.equal('columns cannot be empty');
    }));
  it('status: 405 server responds with invalid method', () => request.delete('/api/topics').expect(405));
  describe('/topics/:topic/articles', () => {
    it('GET status:200 responds with an array of article objects', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0].topic).to.equal('mitch');
      }));
    it('GET status:responds 404 responds for trying to retrieve articles for nonexistent topic', () => request.get('/api/topics/margesimpson/articles').expect(404));
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
          'comment_count',
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
        // console.log('bye', body.articles);
        expect(body.articles).to.have.length(6);
      }));
    it('GET status: 200 each topics responds sorted by date DEFAULT CASE', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      }));
    it('GET status: 200 will default to created_at sort when an invalid sort query is made', () => request
      .get('/api/topics/mitch/articles?sort_by=neetu')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].created_at).to.equal('2018-11-15T12:21:54.171Z');
      }));
    it('GET status: 200 responds sorted by comment_count', () => request
      .get('/api/topics/mitch/articles?sort_by=comment_count')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].comment_count).to.equal('13');
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
        // console.log(body);
        expect(body).to.contain.keys('total_count');
        expect(body.total_count).to.equal('11');
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
    it('status: 404 trying to insert new articles into a non existent topic', () => request
      .post('/api/topics/margesimpson/articles')
      .send({
        title: 'crazylass in tech',
        body: 'I will be supercoder',
        author: 'icellusedkars',
      })
      .expect(404));
    it('status: 400  when non existent column plus wrong format is posted', () => request
      .post('/api/topics/mitch/articles')
      .send({
        tech: 'crazylass in tech',
      })
      .expect(400));
    it('status: 400 trying when incomplete format is posted ', () => request
      .post('/api/topics/mitch/articles')
      .send({
        title: 'Living in the shadow of a great man',
      })
      .expect(400));
    describe('/articles', () => {
      it('GET status:200 responds with an array of topic objects', () => request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.contains.keys('title', 'article_id');
        }));
      it('status: 405 server responds with invalid method when trying to delete all articles', () => request.delete('/api/articles').expect(405));
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
            'comment_count',
          );
        }));
      it('GET status:200 responds with a total_count', () => request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          // console.log('total', body);
          expect(body.total_count).to.equal('12');
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
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
        }));
      it('GET status: 200 will default to created_at sort when an invalid sort query is made', () => request
        .get('/api/articles?sort_by=neetu')
        .expect(200)
        .then(({ body }) => {
          // console.log("neyyyy", body.articles)
          expect(body.articles[0].created_at).to.equal('2018-11-15T12:21:54.171Z');
        }));
      it('GET status: 200 responds sorted by comment_count', () => request
        .get('/api/articles?sort_by=comment_count')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].comment_count).to.equal('13');
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
          // console.log("neetu", body.articles)
          expect(body.articles).to.have.length(2);
        }));
      describe('/articles/:article_id', () => {
        it('GET status:200 responds with an article object for given article_id', () => request
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
              'comment_count',
            );
          }));
        it('status: 405 server responds with invalid method when trying to put', () => request.put('/api/articles/1').expect(405));
        it('GET status:responds 404 for trying to retrive a non existent article_id', () => request.get('/api/articles/100000').expect(404));
        it('PATCH status: 200 can change the votes property', () => request
          .patch('/api/articles/1')
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            // console.log(body.articles);
            expect(body.article.votes).to.equal(99);
          }));
        it('PATCH status: 200 can change the votes property', () => request
          .patch('/api/articles/1')
          .send({ inc_votes: 2 })
          .expect(200)
          .then(({ body }) => {
            // console.log(body);
            expect(body.article.votes).to.equal(102);
          }));
        it('PATCH status: 400 when an integer is not passed', () => request
          .patch('/api/articles/1')
          .send({ inc_votes: 'bbbb' })
          .expect(400));
        it('DELETE status: 204 removes an articles by id', () => request.delete('/api/articles/7').expect(204));
        it('DELETE responds 400 tries to remove a non existent article by id', () => request.delete('/api/articles/888').expect(404));
        it('DELETE responds 404 if given an invalid article id', () => request.delete('/api/articles/opopo').expect(404));
        describe('/articles/:article_id/comments', () => {
          it('GET status:200 responds with an array of comments for given article id', () => request
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.an('array');
              expect(body.comments[0]).to.contains.keys(
                'comment_id',
                'username',
                'article_id',
                'votes',
                'created_at',
                'body',
              );
            }));
          it('GET status:responds 404 when trying to retrieve comments for a nonexistent article_id', () => request.get('/api/articles/99/comments').expect(404));
          it('GET status: 200 each responds with a limit of 10 results DEFAULT CASE', () => request
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.have.length(10);
            }));
        });
        it('status: 405 server responds with invalid method when trying to put', () => request.put('/api/articles/1/comments').expect(405));
        it('GET status: 200 takes a limit query to change the number of comments', () => request
          .get('/api/articles/1/comments?limit=4')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(4);
          }));
      });
      it('GET status: 200 responds with sorted by date DEFAULT CASE', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[0].created_at).to.equal('2016-11-22T12:36:03.389Z');
        }));
    });
    it('GET status: 200 responds with sorted by comment_id', () => request
      .get('/api/articles/1/comments?sort_by=comment_id')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].comment_id).to.equal(18);
      }));
    it('GET status:200 responds with p at 1 with limit of 10 DEFAULT CASE', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(10);
      }));
    it('GET status:200 responds with p at 2 ', () => request
      .get('/api/articles/1/comments?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(3);
      }));
    it('GET status:200 respond order is descending DEFAULT CASE', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].username).to.equal('butter_bridge');
      }));
    it('GET status:200 respond order is ascending', () => request
      .get('/api/articles/1/comments?sort_by=created_at&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].username).to.equal('butter_bridge');
      }));
    it('POST status:201 adding a comment by article_id', () => request
      .post('/api/articles/1/comments')
      .expect(201)
      .send({
        username: 'icellusedkars',
        body: 'worst thing about buying online is having to get up and find your debit card',
      })
      .then(({ body }) => {
        expect(body.comment.body).to.equal(
          'worst thing about buying online is having to get up and find your debit card',
        );
      }));
    it('POST status:404 adding a comment to a non existent article_id', () => request
      .post('/api/articles/1899/comments')
      .expect(404)
      .send({
        username: 'icellusedkars',
        body: 'worst thing about buying online is having to get up and find your debit card',
      })
      .expect(404));
    it('POST status:400 adding a comment missing a body input', () => request
      .post('/api/articles/1/comments')
      .expect(400)
      .send({
        username: 'icellusedkars',
      })
      .expect(400));
    it('POST status:400 adding a comment missing a correct input', () => request
      .post('/api/articles/1/comments')
      .expect(400)
      .send({
        user: 'icellusedkars',
      })
      .expect(400));
  });
  describe('/articles/:article_id/comments/:comment_id', () => {
    it('PATCH status: 200 can change the votes property', () => request
      .patch('/api/articles/1/comments/12')
      .send({ inc_votes: 12 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).to.equal(12);
      }));
    it('PATCH status: 200 can change the votes property', () => request
      .patch('/api/articles/1/comments/12')
      .send({ inc_votes: -2 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).to.equal(-2); // working
      }));
    it('PATCH status: 400 when an integer is not passed', () => request
      .patch('/api/articles/1/comments/12')
      .send({ inc_votes: 'bbbb' })
      .expect(400));
    it('DELETE status: 204 removes a comment from an article by its ID', () => request.delete('/api/articles/9/comments/1').expect(204));
    it('DELETE status: 404 trying to removes comment by non existent article_id', () => request.delete('/api/articles/1000/comments/5').expect(404));
    it('DELETE status: 404 trying to removes comment by invalid article_id', () => request.delete('/api/articles/bbb/comments/5').expect(404));
    describe('api/users', () => {
      it('GET status:200 responds with an array of users objects', () => request
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(body.users).to.be.an('array');
          expect(body.users[0]).to.contains.keys('username', 'name', 'avatar_url');
        }));
      it('status: 405 server responds with invalid method', () => request.delete('/api/users').expect(405));
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
    it('POST status: 400 duplicate detail', () => request
      .post('/api/users')
      .send({
        username: 'icellusedkars',
        name: 'sam',
        avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      })
      .expect(400));
    it('POST status: 400 incomplete detail', () => request
      .post('/api/users')
      .send({
        username: 'neetgurl',
      })
      .expect(400));
    it('POST status: 400 input of incorrect format', () => request
      .post('/api/users')
      .send({
        name: 'neetgurl',
      })
      .expect(400));
    describe('/users/:username', () => {
      it('GET status:200 responds with an user object', () => request
        .get('/api/users/icellusedkars')
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.be.an('object');
          expect(body.user.username).to.equal('icellusedkars');
          expect(body.user).to.contains.keys('name', 'username', 'avatar_url');
        }));
    });
    it('status: 405 server responds with invalid method', () => request.delete('/api/users/icellusedkars').expect(405));
    it('responds status404: when looking for a non existent user', () => request.get('/api/users/homersimpson').expect(404));
    describe('/users/:username/articles', () => {
      it('GET status: 200 returns an array of article objects by the given user', () => request
        .get('/api/users/icellusedkars/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.contains.keys(
            'author',
            'title',
            'article_id',
            'votes',
            'comment_count',
            'created_at',
            'topic',
          );
        }));
      it('status: 405 server responds with invalid method', () => request.delete('/api/users/icellusedkars/articles').expect(405));
      it('GET status:200 responds with a total_count', () => request
        .get('/api/users/icellusedkars/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.total_count).to.have.equal('6');
        }));
      it('GET status:responds 404 for trying to retrieve an array of articles objects for non existent user', () => request.get('/api/users/lisasimpson/articles').expect(404));
      it('GET status: 200 each articles responds with a limit of 10 results DEFAULT CASE', () => request
        .get('/api/users/icellusedkars/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(6);
        }));
      it('GET status: 200 each username responds with a limit of 6 results when ', () => request
        .get('/api/users/icellusedkars/articles?limit=5')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(5);
        }));
      it('GET status: 200 articles sorted by date DEFAULT CASE', () => request
        .get('/api/users/icellusedkars/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Sony Vaio; or, The Laptop');
        }));
      it('GET status: 200 responds sorted by comment_count', () => request
        .get('/api/users/icellusedkars/articles?sort_by=comment_count')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].comment_count).to.equal('1');
        }));
      it('GET status:200 responds with p at 1 with limit of 10 DEFAULT CASE', () => request
        .get('/api/users/icellusedkars/articles?p=1')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(6);
        }));
      it('GET status:200 responds with p at 2 with limit of 10', () => request
        .get('/api/users/icellusedkars/articles?p=2')
        .expect(200)
        .then(({ body }) => {
          // console.log("hiya", body.articles)
          expect(body.articles).to.have.length(0);
        }));
      describe('/api', () => {
        it('GET a json of all the endpoints', () => request
          .get('/api')
          .expect(200)
          .then(({ body }) => {
            expect(body.endPoints).to.have.all.keys(
              'api/topics',
              '/topics/:topic/articles',
              '/articles',
              '/articles/:article_id',
              '/articles/:article_id/comments',
              '/articles/:article_id/comments/:comment_id',
              '/api/users',
              '/users/:username',
              '/users/:username/articles',
            );
          }));
      });
    });
  });
});
