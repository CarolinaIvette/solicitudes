const pool = require('../config/db')

async function getAll(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM areas ORDER BY name')
    res.json(result.rows)
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM areas WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Área no encontrada' })
    res.json(result.rows[0])
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ error: 'El nombre es requerido' })

  try {
    const result = await pool.query(
      'INSERT INTO areas (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ error: 'El nombre es requerido' })

  try {
    const result = await pool.query(
      'UPDATE areas SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Área no encontrada' })
    res.json(result.rows[0])
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM areas WHERE id = $1 RETURNING id', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Área no encontrada' })
    res.json({ message: 'Área eliminada' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, create, update, remove }