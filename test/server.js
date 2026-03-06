const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  host: 'postgres',
  user: 'postgres',
  password: 'password',
  port: 5432,
});

app.get('/query/postgres', async (req, res) => {
  try {
    // Vi kör en fråga som tar lite CPU för att det ska synas i perf
    const result = await pool.query('SELECT count(*) FROM pg_class');
    res.send(`Antal tabeller: ${result.rows[0].count}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log('API redo på port 3000'));