import mysql from "mysql2";
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

// Test the connection
db.getConnection((err, connection) => {
    if (err) {
        // console.error('Error connecting to the database:', err);
        console.error('Error connecting to the database:');

        return;
    }
    console.log('Database connected successfully!');
    connection.release(); // Release the connection back to the pool
});
