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

export const createCareSessionSchema = Joi.object({
  name: Joi.string().trim().max(255).required(),
  shortName: Joi.string().trim().max(100).allow("", null),
  // class code
  classCode: Joi.string().trim().max(255).required(),
  // date only
  serviceDate: Joi.date().required(),
  // times as HH:mm strings
  startTime: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(),
  endTime: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(),
  // optional children ids
  childrenIds: Joi.array()
    .items(Joi.number().integer().min(1))
    .optional(),
});

