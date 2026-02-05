import Joi from "joi";

export const getCareSessionsQuerySchema = Joi.object({
  search: Joi.string().trim().max(255).optional(),
  // class code (e.g. "JER", "DAN")
  class: Joi.string().trim().max(255).optional(),
  // single service date
  date: Joi.date().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

