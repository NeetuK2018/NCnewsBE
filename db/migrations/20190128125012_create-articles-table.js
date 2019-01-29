exports.up = function (connection, Promise) {
  console.log('create article');
  return connection.schema.createTable('articles', (articlesTable) => {
    articlesTable
      .increments('article_id')
      .primary()
      .notNullable();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable
      .integer('votes')
      .defaultTo(0)
      .notNullable();
    articlesTable
      .string('topic')
      .references('topics.slug')
      .onDelete('CASCADE');
    articlesTable
      .string('username')
      .references('users.username')
      .onDelete('CASCADE');
    articlesTable.timestamp('created_at').defaultTo(connection.fn.now());
  });
};

exports.down = function (connection, Promise) {
  console.log('dropping articles');
  return connection.schema.dropTable('articles');
};
