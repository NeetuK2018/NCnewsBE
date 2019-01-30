\c nc_news_test;


-- SELECT * FROM topics;
SELECT * FROM articles;

-- SELECT * FROM topics
-- JOIN articles
-- ON topics.slug = articles.topic WHERE topics.slug = 'mitch';

-- SELECT * FROM comments;

SELECT articles.*, COUNT(comments.comments_id) AS Comment_count FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
WHERE articles.topic = 'mitch'
GROUP BY articles.article_id;



