import { Request, Response } from 'express';
import { ChildrenService } from '../services/children.service.js';
import { getChildrenQuerySchema, createChildSchema } from '../validations/children.js';

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

  /**
   * Create a new child
   * POST /children
   */
  async createChild(req: Request, res: Response): Promise<void> {
    try {
      // Validate and sanitize input parameters using Joi
      const { error, value } = createChildSchema.validate(req.body, {
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

      // Convert dateOfBirth string to Date object if needed
      const childData = {
        ...value,
        dateOfBirth: value.dateOfBirth instanceof Date 
          ? value.dateOfBirth 
          : new Date(value.dateOfBirth),
      };

      // Call service to create child
      const result = await this.service.createChild(childData);

      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating child:', error);
      
      // Check if it's a validation error (class or party not found)
      if (error instanceof Error && error.message.includes('does not exist')) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Failed to create child' });
    }
  }
}
