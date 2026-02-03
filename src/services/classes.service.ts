import { ClassesRepository } from '../repositories/classes.repository.js';

export interface GetClassesParams {
  search?: string;
  page: number;
  limit: number;
}

export interface GetClassesResult {
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ClassesService {
  private repository: ClassesRepository;

  constructor(repository: ClassesRepository) {
    this.repository = repository;
  }

  /**
   * Get paginated list of classes with filters
   */
  async getClasses(params: GetClassesParams): Promise<GetClassesResult> {
    const { search, page, limit } = params;
    const offset = (page - 1) * limit;

    // Build where clause for classes
    const whereClause = this.repository.buildWhereClause(search);

    // Get total count and classes list in parallel
    const [totalCount, classesList] = await Promise.all([
      this.repository.count(whereClause),
      this.repository.findMany(whereClause, offset, limit),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: classesList,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
      },
    };
  }
}
