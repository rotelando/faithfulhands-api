import Joi from 'joi';

export const getPartiesQuerySchema = Joi.object({
  search: Joi.string().trim().max(255).optional(),
  role: Joi.string().valid('guardian', 'staff').optional(),
  onlyActive: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
