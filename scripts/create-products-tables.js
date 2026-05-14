// 创建产品表的脚本
const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function createTables() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const sql = fs.readFileSync('./lib/create-products-tables.sql', 'utf8');
    const statements = sql.split(';').filter(s => s.trim().length > 0);

    for (const statement of statements) {
      try {
        await client.query(statement);
        console.log('Executed:', statement.substring(0, 50).trim() + '...');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Already exists:', statement.substring(0, 50).trim() + '...');
        } else {
          console.error('Error executing statement:', err.message);
        }
      }
    }

    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

createTables();
