const fs = require('fs');
const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const sql = fs.readFileSync('./restaurant_db.sql', 'utf8');

connection.query(sql, (err) => {
  if (err) {
    console.error("❌ Import Failed:", err);
    process.exit(1);
  }
  console.log("🎉 Database Imported Successfully!");
  process.exit();
});
