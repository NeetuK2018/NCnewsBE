\c nc_news_test;


-- SELECT * FROM topics;

-- SELECT articles.*, COUNT(comments.comments_id)
-- AS Comment_count FROM articles
-- LEFT JOIN comments
-- ON articles.article_id = comments.article_id
-- WHERE articles.topic = 'mitch'
-- GROUP BY articles.article_id
-- ORDER BY created_at DESC
-- LIMIT 10 OFF SET 10




-- SELECT * from articles;



-- SELECT articles.*, COUNT(comments.comments_id)
-- AS Comment_count FROM  articles
-- LEFT JOIN comments
-- on articles.article_id = comments.article_id
-- WHERE articles.article_id = 5
-- GROUP BY articles.article_id;