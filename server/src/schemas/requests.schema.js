const { z } = require('zod')

const createRequestSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  area_id: z.number().int(),
  category_id: z.number().int().optional(),
})

const updateRequestSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  area_id: z.number().int().optional(),
  category_id: z.number().int().optional(),
})

module.exports = { createRequestSchema, updateRequestSchema }
