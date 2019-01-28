exports.up = function (connection, Promise) {
  console.log('create topic');
  return connection.schema.createTable('topics', (topicsTable) => {
    topicsTable
      .string('slug')
      .primary()
      .notNullable();
    topicsTable.string('description').notNullable();
  });
};

exports.down = function (connection, Promise) {
  console.log('drop topic');
  return connection.schema.dropTable('topics');
};
