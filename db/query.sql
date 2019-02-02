\c nc_news_test;


SELECT * FROM articles;

-- SELECT articles.*, COUNT(comments.comments_id) 
-- AS Comment_count FROM articles
-- LEFT JOIN comments
-- ON articles.article_id = comments.article_id
-- WHERE articles.topic = 'mitch'
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


-- SELECT * from comments 
-- left JOIN  articles ON articles.article_id = comments.article_id
-- WHERE articles.article_id = 2;



-- SELECT articles.*, COUNT(comments.comments_id)
-- AS Comment_count FROM  articles
-- LEFT JOIN comments
-- on articles.article_id = comments.article_id
-- WHERE articles.article_id = 5
-- GROUP BY articles.article_id;

SELECT users.* FROM users;
