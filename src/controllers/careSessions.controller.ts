
import { CareSessionsService } from "../services/careSessions.service.js";
import { CreateCareSessionParams, GetCareSessionByIdResult, GetCareSessionsParams } from "../types";
import {
  getCareSessionsQuerySchema,
  createCareSessionSchema,
  getCareSessionByIdSchema,
} from "../validations/careSessions.js";
import { Request, Response } from "express";

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

      const params: GetCareSessionsParams = {
        page,
        limit,
      };
      
      if (search !== undefined) {
        params.search = search;
      }
      if (classCode !== undefined) {
        params.class = classCode;
      }
      if (dateString !== undefined) {
        params.date = dateString;
      }
        
      const result = await this.service.getCareSessions(params);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching care sessions:", error);
      res.status(500).json({ error: "Failed to get care sessions" });
    }
  }

  /**
   * Create a new care session
   * POST /careSessions
   */
  async createCareSession(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = createCareSessionSchema.validate(req.body, {
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

      const {
        name,
        shortName,
        classCode,
        serviceDate,
        startTime,
        endTime,
        children,
      } = value as {
        name: string;
        shortName?: string | null;
        classCode: string;
        serviceDate: Date;
        startTime: string;
        endTime: string;
        children: {
          childId: number;
          partyId: number;
          relationship: string;
        }[];
      };

      const result = await this.service.createCareSession({
        name,
        shortName: shortName ?? null,
        classCode,
        serviceDate,
        startTime,
        endTime,
        children
      } as CreateCareSessionParams);

      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating care session:", error);

      if (error instanceof Error && error.message.includes("does not exist")) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: "Failed to create care session" });
    }
  }

  /**
   * Update a care session
   * GET /careSessions/:id
   */
  async getCareSessionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error, value } = getCareSessionByIdSchema.validate({ id: id as string }, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        res.status(400).json({ error: "Validation error", details: error.details.map((detail) => ({ field: detail.path.join("."), message: detail.message })) });
      }

      const result: GetCareSessionByIdResult = await this.service.getCareSessionById(value.id);

      res.status(200).json({data: result});
    } catch (error) {
      console.error("Error getting care session by id:", error);
      res.status(500).json({ error: "Failed to get care session by id" });
    }
  }
}
