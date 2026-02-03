import Joi from 'joi';

export const getChildrenQuerySchema = Joi.object({
  search: Joi.string().trim().max(255).optional(),
  class: Joi.string().trim().max(255).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
