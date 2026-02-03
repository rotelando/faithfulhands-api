import Joi from 'joi';

export const getChildrenQuerySchema = Joi.object({
  search: Joi.string().trim().max(255).optional(),
  class: Joi.string().trim().max(255).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const createChildSchema = Joi.object({
  firstName: Joi.string().trim().max(255).required(),
  lastName: Joi.string().trim().max(255).required(),
  gender: Joi.string().trim().max(255).required(),
  dateOfBirth: Joi.date().required(),
  allergies: Joi.string().trim().max(255).optional().allow(null, ''),
  classId: Joi.number().integer().min(1).required(),
  parties: Joi.array().items(
    Joi.object({
      partyId: Joi.number().integer().min(1).required(),
      relationship: Joi.string().trim().max(255).required(),
    })
  ).min(1).required(),
});
