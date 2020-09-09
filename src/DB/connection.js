const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
  user: 'bsale_test',
  password: 'bsale_test',
  database: 'bsale_test'
});

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'bsale'
// });

// Check connect DB
pool.getConnection(function (err, connection) {
  if (err) {
    throw err;
  } else {
    console.log('Database conected');
  }

});

module.exports = pool;
