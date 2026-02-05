import { CareSessionsRepository } from "../repositories/careSessions.repository.js";

export interface GetCareSessionsParams {
  search?: string;
  class?: string; // class code
  date?: string;  // YYYY-MM-DD
  page: number;
  limit: number;
}

export interface GetCareSessionsResult {
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCareSessionParams {
  name: string;
  shortName?: string | null;
  classCode: string;
  serviceDate: Date;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  children?: {
    childId: number;
    partyId: number;
    relationship: string;
  }[];
}

export interface CreateCareSessionResult {
  data: {
    id: string;
  };
}

export class CareSessionsService {
  private repository: CareSessionsRepository;

  constructor(repository: CareSessionsRepository) {
    this.repository = repository;
  }

  /**
   * Get paginated list of care sessions with filters
   */
  async getCareSessions(
    params: GetCareSessionsParams,
  ): Promise<GetCareSessionsResult> {
    const { search, page, limit } = params;
    const classCode = params.class;
    const date = params.date;
    const offset = (page - 1) * limit;

    const whereClause = this.repository.buildWhereClause(
      search,
      classCode,
      date,
    );

    const [totalCount, list] = await Promise.all([
      this.repository.count(whereClause),
      this.repository.findMany(whereClause, offset, limit),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: list,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Create a new care session with optional children.
   */
  async createCareSession(
    params: CreateCareSessionParams,
  ): Promise<CreateCareSessionResult> {
    const { name, shortName, classCode, serviceDate, startTime, endTime } =
      params;
    const children = params.children ?? [];

    console.log('Children', children);

    // Resolve class id by code
    const classId = await this.repository.findClassIdByCode(classCode);
    if (!classId) {
      throw new Error(`Class with code ${classCode} does not exist`);
    }

    // Validate children existence
    if (children.length) {
      const missing = await this.repository.findMissingChildrenIds(children.map((child) => child.childId));
      if (missing.length) {
        throw new Error(
          `Children with IDs ${missing.join(", ")} do not exist`,
        );
      }
    }

    // Build full Date objects for start and end times
    const baseDate = new Date(
      serviceDate.getFullYear(),
      serviceDate.getMonth(),
      serviceDate.getDate(),
    );

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const startDateTime = new Date(baseDate);
    startDateTime.setHours(sh ?? 0, sm ?? 0, 0, 0);

    const endDateTime = new Date(baseDate);
    endDateTime.setHours(eh ?? 0, em ?? 0, 0, 0);

    // Persist care session
    const id = await this.repository.createCareSession({
      name,
      shortName: shortName ?? null,
      classId,
      serviceDate: serviceDate.toISOString().split("T")[0]!,
      startDateTime,
      endDateTime,
    });

    console.log('Care session ID', id);
    console.log('Children', children);

    // Persist optional children links
    try {
    if (children.length) {
        await this.repository.createCareSessionsChildren(id, children);
      }
    } catch (error) {
      throw new Error(`Failed to create care session: ${error}`);
    }

    return { data: { id } };
  }
}

