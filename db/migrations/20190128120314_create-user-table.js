exports.up = function (connection, Promise) {
  return connection.schema.createTable('users', (userTable) => {
    userTable
      .string('username')
      .primary()
      .notNullable();
    userTable.string('avatar_url', 500).notNullable();
    userTable.string('name').notNullable();
  });
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('users');
};
