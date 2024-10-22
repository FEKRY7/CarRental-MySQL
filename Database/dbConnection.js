const mysql = require('mysql');

const db = mysql.createPool({
  host     : 'localhost',
  user     : 'root',      // Changed 'username' to 'user'
  password : '',
  database : 'carrental'
});   

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database successfully');
    connection.release(); // Important to release the connection when using connection pools
  }
});

module.exports = db;