const pool = require('../config/db')

async function getAll(req, res) {
  try {
    const result = await pool.query(`
      SELECT r.*, u.name AS user_name, a.name AS area_name, c.name AS category_name
      FROM requests r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN areas a ON r.area_id = a.id
      LEFT JOIN categories c ON r.category_id = c.id
      ORDER BY r.created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

async function getById(req, res) {
  try {
    const result = await pool.query(`
      SELECT r.*, u.name AS user_name, a.name AS area_name, c.name AS category_name
      FROM requests r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN areas a ON r.area_id = a.id
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.id = $1
    `, [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Solicitud no encontrada' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

async function create(req, res) {
  const { title, description, area_id, category_id } = req.body
  const userId = req.session.userId

  try {
    const result = await pool.query(
      `INSERT INTO requests (title, description, status, user_id, area_id, category_id)
       VALUES ($1, $2, 'pending', $3, $4, $5) RETURNING *`,
      [title, description, userId, area_id, category_id || null]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

async function update(req, res) {
  const { title, description, status, area_id, category_id } = req.body

  try {
    const current = await pool.query('SELECT * FROM requests WHERE id = $1', [req.params.id])
    if (!current.rows[0]) return res.status(404).json({ error: 'Solicitud no encontrada' })

    const result = await pool.query(
      `UPDATE requests
       SET title = $1, description = $2, status = $3, area_id = $4, category_id = $5, updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [
        title ?? current.rows[0].title,
        description ?? current.rows[0].description,
        status ?? current.rows[0].status,
        area_id ?? current.rows[0].area_id,
        category_id ?? current.rows[0].category_id,
        req.params.id,
      ]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

async function remove(req, res) {
  try {
    const result = await pool.query('DELETE FROM requests WHERE id = $1 RETURNING id', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Solicitud no encontrada' })
    res.json({ message: 'Solicitud eliminada' })
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

module.exports = { getAll, getById, create, update, remove }
