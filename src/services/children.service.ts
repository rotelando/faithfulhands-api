import { ChildrenRepository } from '../repositories/children.repository.js';

export interface GetChildrenParams {
  search?: string;
  class?: string;
  page: number;
  limit: number;
}

export interface GetChildrenResult {
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export class ChildrenService {
  private repository: ChildrenRepository;

  constructor(repository: ChildrenRepository) {
    this.repository = repository;
  }

  /**
   * Get paginated list of children with filters
   */
  async getChildren(params: GetChildrenParams): Promise<GetChildrenResult> {
    const { search, page, limit } = params;
    const className = params.class;
    const offset = (page - 1) * limit;

    // If className filter is provided, get matching class IDs first
    let classIds: number[] | undefined;
    if (className) {
      classIds = await this.repository.findClassIdsByName(className);
      
      // If no classes match, return empty result early
      if (classIds.length === 0) {
        return {
          data: [],
          pagination: {
            total: 0,
            page,
            limit,
          },
        };
      }
    }

    // Build where clause for children
    const whereClause = this.repository.buildWhereClause(search, classIds);

    // Get total count and children list in parallel
    const [totalCount, childrenList] = await Promise.all([
      this.repository.count(whereClause),
      this.repository.findMany(whereClause, offset, limit),
    ]);

    return {
      data: childrenList,
      pagination: {
        total: totalCount,
        page,
        limit,
      },
    };
  }
}
