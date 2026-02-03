import { Request, Response } from 'express';
import { ClassesService } from '../services/classes.service.js';
import { getClassesQuerySchema } from '../validations/classes.js';

export class ClassesController {
  private service: ClassesService;

  constructor(service: ClassesService) {
    this.service = service;
  }

  /**
   * Get list of classes with pagination and filters
   * GET /classes
   */
  async getClasses(req: Request, res: Response): Promise<void> {
    try {
      // Validate and sanitize input parameters using Joi
      const { error, value } = getClassesQuerySchema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        });
        return;
      }

      const { search, page, limit } = value;

      // Call service to get classes
      const result = await this.service.getClasses({
        search,
        page: page,
        limit: limit,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ error: 'Failed to get classes' });
    }
  }
}
