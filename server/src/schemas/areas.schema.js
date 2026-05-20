const { z } = require('zod');

const createAreaSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional()
});

const updateAreaSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional()
});

module.exports = { createAreaSchema, updateAreaSchema };
