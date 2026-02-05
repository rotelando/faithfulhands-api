import { Request, Response } from "express";
import { CareSessionsService } from "../services/careSessions.service.js";
import { getCareSessionsQuerySchema } from "../validations/careSessions.js";

export class CareSessionsController {
  private service: CareSessionsService;

  constructor(service: CareSessionsService) {
    this.service = service;
  }

  /**
   * Get list of care sessions with pagination and filters
   * GET /careSessions
   */
  async getCareSessions(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = getCareSessionsQuerySchema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        res.status(400).json({
          error: "Validation error",
          details: error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
          })),
        });
        return;
      }

      const { search, class: classCode, date, page, limit } = value as {
        search?: string;
        class?: string;
        date?: Date;
        page: number;
        limit: number;
      };

      const dateString =
        date instanceof Date ? date.toISOString().split("T")[0] : undefined;

      const result = await this.service.getCareSessions({
        search,
        class: classCode,
        date: dateString,
        page,
        limit,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching care sessions:", error);
      res.status(500).json({ error: "Failed to get care sessions" });
    }
  }
}

