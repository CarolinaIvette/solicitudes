const { ZodError } = require('zod');

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({ errors: err.flatten().fieldErrors });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { errorHandler };
