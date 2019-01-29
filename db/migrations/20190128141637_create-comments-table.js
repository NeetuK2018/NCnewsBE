exports.up = function (connection, Promise) {
  console.log('create comments');
  return connection.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comments_id').primary();
    commentsTable
      .string('username')
      .references('users.username')
      .onDelete('CASCADE');
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .onDelete('CASCADE');
    commentsTable
      .integer('votes')
      .defaultTo(0)
      .notNullable();
    commentsTable.timestamp('created_at').defaultTo(connection.fn.now());
    commentsTable.text('body').notNullable();
  });
};

exports.down = function (connection, Promise) {
  console.log('drop comments');
  return connection.schema.dropTable('comments');
};