1) /
/api
  /topics
    POST status:422 client sends a body with a duplicate slug:
Error: expected 422 "Unprocessable Entity", got 500 "Internal Server Error"

* Need to add an error code to one of the error handling middleware functions

2) /
/api
  /topics
    POST status:400 if request body is malformed (missing description property):
Error: expected 400 "Bad Request", got 500 "Internal Server Error"

* Need error code for the POST body when it is missing a description!

3) /
/api
  /topics
    status:405 invalid HTTP method for this resource:
Error: expected 405 "Method Not Allowed", got 404 "Not Found"

```js
request
.post('/api/topics')
.send({ slug: 'sluggy boi' })
```


6) /
/api
  /topics/:topic/articles
    GET status:200
      responds with a total_count property giving the number of articles for that topic:
AssertionError: expected [ { total_count: '11' } ] to equal '11'

* Pull off the total_count property for articles in both your getArticlesByTopic and getArticles controllers

7) /
/api
  /topics/:topic/articles
    GET status:200
      returns default response if given invalid sort_by (DEFAULT order_by: created_at) order (DEFAULT sort_order: DESC):
Error: expected 200 "OK", got 400 "Bad Request"

* Need to check sort_by to see if it one of the fields on your article table and if NOT then default to created_at

8) /
/api
  /topics/:topic/articles
    GET status:200
      all article objects have a comment_count property:
AssertionError: expected undefined to equal '13'

* Using Comment_count -> change to lowercase!

9) /
/api
  /topics/:topic/articles
    ERRORS
      GET status:404 responds with 404 for a non-existent topic:
Error: expected 404 "Not Found", got 200 "OK"

* If you do a request with a non-existent topic knex DOES NOT error out!
Check array length of articles and if empty then reject with status 404!

10) /
/api
  /topics/:topic/articles
    ERRORS
      POST status:404 adding an article to a non-existent topic:
Error: expected 404 "Not Found", got 500 "Internal Server Error"

* Try to POST an article with a non-existent topic then you will get an error from knex

11) /
/api
  /topics/:topic/articles
    ERRORS
      invalid methods respond with 405:
Error: expected 405 "Method Not Allowed", got 404 "Not Found"

* Dont worry about this !

12) /
/api
  /topics/:topic/articles
    ERRORS
      POST status:400 if body is malformed (not null) (missing username and body):
Error: expected 400 "Bad Request", got 500 "Internal Server Error"

* Write a test without a body and without a username -> use the error code in your POSTing article!

13) /
/api
  /articles
    status:405 invalid request method for end-point:
Error: expected 405 "Method Not Allowed", got 404 "Not Found"

* Ignore for time being!

14) /
/api
  /articles
    GET status:200
      will ignore an invalid sort_by query:
Error: expected 200 "OK", got 400 "Bad Request"

* Check to see if sort_by is on the articles table! e.g. is it votes, article_id etc...


15) /
/api
  /articles
    GET status:200
      article objects have a comment_count property:
AssertionError: expected undefined to equal '13'

* Use comment_count not Comment_count !

17) /
/api
  /articles/:article_id
    GET status:404 url contains a non-existent (but potentially valid) article_id:
Error: expected 404 "Not Found", got 200 "OK"

* Check to see if articles length is zero and then reject with status 404!

18) /
/api
  /articles/:article_id
    GET status:400 URL contains an invalid article_id:
Error: expected 400 "Bad Request", got 500 "Internal Server Error"


* Need to add code to the relevant error handler!

19) /
/api
  /articles/:article_id
    PATCH status:400 if given an invalid inc_votes:
Error: expected 400 "Bad Request", got 404 "Not Found"

* Check to see if `inc_votes` is not a number and if so call next with 400 object

20) /
/api
  /articles/:article_id
    PATCH status:200s no body responds with an unmodified article:
Error: expected 200 "OK", got 404 "Not Found"

* Don't worry about this problem!

22) /
/api
  /articles/:article_id
    DELETE responds with 400 on invalid article_id:
Error: expected 400 "Bad Request", got 500 "Internal Server Error"

* Need to invalid article_id with a code in the error handler!


24) /
/api
  /api/articles/:article_id/comments
    GET
      status:200
        can change the sort order (DEFAULT sort_by=created_at):

AssertionError: expected 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.' to equal 'This morning, I showered for nine minutes.'
+ expected - actual

-The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.
+This morning, I showered for nine minutes.

* Swap parameter order in the fetchCommentsByArticleID controller!

25) /
/api
  /articles/:article_id/comments/:comment_id
    PATCH status:200 and an updated comment when given a body including a valid "inc_votes" (VOTE DOWN):
Error: expected 200 "OK", got 400 "Bad Request"

* So change status code to 200 and make sure you are doing comments.comments_id -> 
ideally you should have comments.comment_id!


27) /
/api
  /articles/:article_id/comments/:comment_id
    PATCH status:404 non-existent article_id is used:
Error: expected 404 "Not Found", got 400 "Bad Request"


* Need to error handle for this when a non-existent article_id is not used!s

28) /
/api
  /articles/:article_id/comments/:comment_id
    PATCH status:404 non-existent comment_id is used:
Error: expected 404 "Not Found", got 400 "Bad Request"

* Error handle when using a non-existent comment_id!


29) /
/api
  /articles/:article_id/comments/:comment_id
    DELETE status:204 deletes the comment and responds with No Content:
Error: expected 204 "No Content", got 400 "Bad Request"

* Double check the columns are referencing the column table when you are deleting a comment!

30) /
/api
  /articles/:article_id/comments/:comment_id
    DELETE status:404 client uses a non-existent article_id:
Error: expected 404 "Not Found", got 400 "Bad Request"

* Need to error-handler for this case similar to the DELETing of articles!

31) /
/api
  /articles/:article_id/comments/:comment_id
    DELETE status:404 client uses non-existent comment_id:
Error: expected 404 "Not Found", got 400 "Bad Request"

* Handle the non-existent comment_id!


34) /
/users/:username
  GET status:200 responds with a user object when given a valid username:
AssertionError: expected undefined to deeply equal { Object (username, name, ...) }
at request.get.expect.then (spec/nc.spec.js:678:32)

res.status(200).send({user}) //<-- singular here!!!

35) /
/users/:username
  GET status:404 when a non-existent username:
Error: expected 404 "Not Found", got 200 "OK"

* Handle the non-existent username



