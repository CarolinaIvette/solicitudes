function checkRole(...roles) {
  return (req, res, next) => {
    if (req.session && roles.includes(req.session.userRole)) return next()
    res.status(403).json({ error: 'No autorizado' })
  }
}

module.exports = { checkRole }
 