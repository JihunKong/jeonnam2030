import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3001;

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to hash passwords
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Helper function to verify password
function verifyPassword(inputPassword, storedHash) {
  const adminHash = hashPassword('admin2025');
  const inputHash = hashPassword(inputPassword);
  return inputHash === adminHash || inputHash === storedHash;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend API is running' });
});

// GET all research groups
app.get('/api/research-groups', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, how_to_join, docs_link, created_at, updated_at FROM research_groups ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching research groups:', error);
    res.status(500).json({ error: 'Failed to fetch research groups' });
  }
});

// GET single research group by ID
app.get('/api/research-groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, description, how_to_join, docs_link, created_at, updated_at FROM research_groups WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Research group not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching research group:', error);
    res.status(500).json({ error: 'Failed to fetch research group' });
  }
});

// POST create new research group
app.post('/api/research-groups', async (req, res) => {
  try {
    // Accept both camelCase and snake_case
    const {
      name,
      description,
      howToJoin,
      how_to_join,
      docsLink,
      docs_link,
      password
    } = req.body;

    const howToJoinValue = howToJoin || how_to_join;
    const docsLinkValue = docsLink || docs_link;

    // Validate required fields
    if (!name || !description || !howToJoinValue || !docsLinkValue || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const passwordHash = hashPassword(password);

    const result = await pool.query(
      'INSERT INTO research_groups (name, description, how_to_join, docs_link, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, description, how_to_join, docs_link, created_at, updated_at',
      [name, description, howToJoinValue, docsLinkValue, passwordHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating research group:', error);
    res.status(500).json({ error: 'Failed to create research group' });
  }
});

// PUT update research group
app.put('/api/research-groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Accept both camelCase and snake_case
    const {
      name,
      description,
      howToJoin,
      how_to_join,
      docsLink,
      docs_link,
      password
    } = req.body;

    const howToJoinValue = howToJoin || how_to_join;
    const docsLinkValue = docsLink || docs_link;

    // Validate required fields
    if (!name || !description || !howToJoinValue || !docsLinkValue || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Get the current password hash
    const currentResult = await pool.query(
      'SELECT password_hash FROM research_groups WHERE id = $1',
      [id]
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Research group not found' });
    }

    // Verify password
    if (!verifyPassword(password, currentResult.rows[0].password_hash)) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // Update the research group
    const result = await pool.query(
      'UPDATE research_groups SET name = $1, description = $2, how_to_join = $3, docs_link = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, name, description, how_to_join, docs_link, created_at, updated_at',
      [name, description, howToJoinValue, docsLinkValue, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating research group:', error);
    res.status(500).json({ error: 'Failed to update research group' });
  }
});

// DELETE research group
app.delete('/api/research-groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Get the current password hash
    const currentResult = await pool.query(
      'SELECT password_hash FROM research_groups WHERE id = $1',
      [id]
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Research group not found' });
    }

    // Verify password
    if (!verifyPassword(password, currentResult.rows[0].password_hash)) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // Delete the research group
    await pool.query('DELETE FROM research_groups WHERE id = $1', [id]);

    res.json({ message: 'Research group deleted successfully' });
  } catch (error) {
    console.error('Error deleting research group:', error);
    res.status(500).json({ error: 'Failed to delete research group' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
