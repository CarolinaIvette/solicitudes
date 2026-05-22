const pool = require('../config/db')

async function getAll(req, res, next) {
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
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT r.*, u.name AS user_name, a.name AS area_name, c.name AS category_name
      FROM requests r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN areas a ON r.area_id = a.id
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.id = $1
    `, [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }
    res.json(result.rows[0])
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const { title, description, area_id, category_id } = req.body
    const result = await pool.query(`
      INSERT INTO requests (title, description, area_id, category_id, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [title, description, area_id, category_id, req.session.userId])
    res.status(201).json(result.rows[0])
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params
    const { title, description, area_id, category_id, status } = req.body
    const result = await pool.query(`
      UPDATE requests
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          area_id = COALESCE($3, area_id),
          category_id = COALESCE($4, category_id),
          status = COALESCE($5, status),
          updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [title, description, area_id, category_id, status, id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }
    res.json(result.rows[0])
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params
    const result = await pool.query(`
      DELETE FROM requests WHERE id = $1 RETURNING *
    `, [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }
    res.json({ message: 'Solicitud eliminada correctamente' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, create, update, remove }