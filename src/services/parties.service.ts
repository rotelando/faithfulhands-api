import { PartiesRepository } from '../repositories/parties.repository.js';

export interface GetPartiesParams {
  search?: string;
  role?: 'guardian' | 'staff';
  onlyActive?: boolean;
  page: number;
  limit: number;
}

export interface GetPartiesResult {
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class PartiesService {
  private repository: PartiesRepository;

  constructor(repository: PartiesRepository) {
    this.repository = repository;
  }

  /**
   * Get paginated list of parties with filters
   */
  async getParties(params: GetPartiesParams): Promise<GetPartiesResult> {
    const { search, role, onlyActive, page, limit } = params;
    const offset = (page - 1) * limit;

    // Build where clause for parties
    const whereClause = this.repository.buildWhereClause(search, role, onlyActive);

    // Get total count and parties list in parallel
    const [totalCount, partiesList] = await Promise.all([
      this.repository.count(whereClause),
      this.repository.findMany(whereClause, offset, limit),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: partiesList,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
      },
    };
  }
}
