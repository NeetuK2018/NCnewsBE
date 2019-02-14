\c nc_news_test;


-- SELECT articles.*  COUNT(comments.comments_id) AS Comment_count
--  FROM articles, 
-- LEFT JOIN comments  ON articles.author = comments.username 
-- WHERE articles.author = 'icellusedkars' 
-- group by articles.author;

-- SELECT * FROM comments where comments.username = 'icellusedkars';
-- SELECT articles.* from articles JOIN comments on articles.author = comments.username WHERE articles.author = 'icellusedkars';
-- SELECT articles.*, COUNT(comments.comments_id) 
-- AS Comment_count FROM articles
-- LEFT JOIN comments
-- ON articles.article_id = comments.article_id
-- WHERE users.username = 'icellusedkars'
-- GROUP BY articles.article_id
-- ORDER BY created_at DESC;


-- SELECT topics.slug, articles.* COUNT(articles.article_id) AS Total_count 
-- from topics
--  JOIN articles ON topics.slug = articles.topic

--  WHERE topics.slug = 'mitch'
--   GROUP BY topics.slug;


-- SELECT topics.slug, articles.article_id
-- from topics

--  JOIN articles ON topics.slug = articles.topic

--  WHERE topics.slug = 'mitch';

-- SELECT COUNT(articles.title) AS total_count
-- FROM articles
-- WHERE topic = 'mitch';
-- select * from comments where article_id = 1;
SELECT * FROM articles;
select * from comments;

-- SELECT comments.*  FROM comments  Join articles on comments_id= articles.article_id where comments.comments_id = 12;

-- JOIN articles ON comments.article_id = articles.article_id
-- WHERE comments.article_id = 1;

-- SELECT * from comments WHERE article_id = 1;
-- SELECT articles.* FROM articles JOIN comments on 
-- WHERE article_id = 1;

-- left JOIN  articles ON articles.article_id = comments.article_id
-- WHERE articles.article_id = 2;



-- SELECT articles.*, COUNT(comments.comments_id)
-- AS Comment_count FROM  articles
-- LEFT JOIN comments
-- on articles.article_id = comments.article_id
-- WHERE articles.article_id = 5
-- GROUP BY articles.article_id;

-- SELECT users.* FROM users;


-- const fetchArticlesByUsername = (
--   { username },
--   { limit = 10, sort_by = "created_at", order = "desc", p = 1 }
-- ) => {
--   return connection
--     .select(
--       { author: "articles.username" },
--       "articles.title",
--       "articles.article_id",
--       "articles.votes",
--       "articles.created_at",
    --   "articles.topic"
    -- )
    -- .count("comment.comment_id")
--     .as("comment_count")
--     .from("articles")
--     .leftJoin("comment", "articles.article_id", "comment.article_id")
--     .where("articles.username", "=", username)
--     .limit(limit)
--     .offset((parseInt(p) - 1) * limit)
--     .orderBy(sort_by, order)
--     .groupBy("articles.article_id");
-- };