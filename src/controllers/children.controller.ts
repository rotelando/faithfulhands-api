import { Request, Response } from 'express';
import { ChildrenService } from '../services/children.service';
import { getChildrenQuerySchema } from '../validations/children';

export class ChildrenController {
  private service: ChildrenService;

  constructor(service: ChildrenService) {
    this.service = service;
  }

  /**
   * Get list of children with pagination and filters
   * GET /children
   */
  async getChildren(req: Request, res: Response): Promise<void> {
    try {
      // Validate and sanitize input parameters using Joi
      const { error, value } = getChildrenQuerySchema.validate(req.query, {
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

      // Call service to get children
      const result = await this.service.getChildren({
        search,
        class: value.class,
        page: page,
        limit: limit,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching children:', error);
      res.status(500).json({ error: 'Failed to get children' });
    }
  }
}
