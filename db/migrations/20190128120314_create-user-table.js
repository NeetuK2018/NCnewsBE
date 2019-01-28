exports.up = function (connection, Promise) {
  console.log('creating users');
  return connection.schema.createTable('users', (userTable) => {
    userTable
      .string('username')
      .primary()
      .notNullable();
    userTable.string('avatar_url').notNullable();
    userTable.string('name').notNullable();
  });
};

exports.down = function (connection, Promise) {
  console.log('dropping users');
  return connection.schema.dropTable('users');
};
