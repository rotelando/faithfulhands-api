import { Request, Response } from 'express';
import { PartiesService } from '../services/parties.service.js';
import { getPartiesQuerySchema } from '../validations/parties.js';

export class PartiesController {
  private service: PartiesService;

  constructor(service: PartiesService) {
    this.service = service;
  }

  /**
   * Get list of parties with pagination and filters
   * GET /parties
   */
  async getParties(req: Request, res: Response): Promise<void> {
    try {
      // Validate and sanitize input parameters using Joi
      const { error, value } = getPartiesQuerySchema.validate(req.query, {
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

      // Call service to get parties
      const result = await this.service.getParties({
        search,
        page: page,
        limit: limit,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching parties:', error);
      res.status(500).json({ error: 'Failed to get parties' });
    }
  }
}
