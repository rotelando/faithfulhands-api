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
}

