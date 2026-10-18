const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
app.use(express.static('public'));

let pool;

const tables = {
  members: {
    table: 'members',
    columns: ['name', 'email', 'phone', 'role']
  },
  activities: {
    table: 'activities',
    columns: ['title', 'description', 'activity_date']
  },
  contributions: {
    table: 'contributions',
    columns: ['member_id', 'amount', 'note']
  },
  meetings: {
    table: 'meetings',
    columns: ['title', 'meeting_date', 'location']
  }
};

async function connectDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'clubuser',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'clubdb',
    waitForConnections: true,
    connectionLimit: 10
  });

  const connection = await pool.getConnection();
  connection.release();
  console.log('Ket noi MySQL thanh cong');
}

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error' });
  }
});

Object.entries(tables).forEach(([route, config]) => {
  const { table, columns } = config;

  app.get('/api/' + route, async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM `' + table + '` ORDER BY id DESC'
      );
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Loi truy van du lieu' });
    }
  });

  app.post('/api/' + route, async (req, res) => {
    try {
      const values = columns.map(c => req.body[c] ?? null);
      const placeholders = columns.map(() => '?').join(',');
      const names = columns.map(c => '`' + c + '`').join(',');

      const [result] = await pool.execute(
        'INSERT INTO `' + table + '` (' + names +
        ') VALUES (' + placeholders + ')',
        values
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Khong the them du lieu' });
    }
  });

  app.put('/api/' + route + '/:id', async (req, res) => {
    try {
      const fields = columns
        .map(c => '`' + c + '` = ?')
        .join(',');
      const values = columns.map(c => req.body[c] ?? null);

      const [result] = await pool.execute(
        'UPDATE `' + table + '` SET ' + fields +
        ' WHERE id = ?',
        [...values, req.params.id]
      );
      res.json({ updated: result.affectedRows });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Khong the sua du lieu' });
    }
  });

  app.delete('/api/' + route + '/:id', async (req, res) => {
    try {
      const [result] = await pool.execute(
        'DELETE FROM `' + table + '` WHERE id = ?',
        [req.params.id]
      );
      res.json({ deleted: result.affectedRows });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Khong the xoa du lieu' });
    }
  });
});

const PORT = 3000;

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('Club Management dang chay cong 3000');
    });
  })
  .catch(err => {
    console.error('Loi ket noi database:', err.message);
    process.exit(1);
  });
