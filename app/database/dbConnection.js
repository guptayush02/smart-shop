const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'sql8.freesqldatabase.com',
  user: 'sql8793862',
  password: 'I5vZt7ByqY',
  database: 'sql8793862'
})

module.exports = connection;
