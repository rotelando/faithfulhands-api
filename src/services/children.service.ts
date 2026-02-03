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

export interface CreateChildParams {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  allergies?: string | null;
  classId: number;
  parties: Array<{ partyId: number; relationship: string }>;
}

export interface CreateChildResult {
  data: number;
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

  /**
   * Create a new child with parties
   */
  async createChild(params: CreateChildParams): Promise<CreateChildResult> {
    const { classId, parties, ...childData } = params;

    // Validate class exists
    const classExists = await this.repository.validateClassExists(classId);
    if (!classExists) {
      throw new Error(`Class with ID ${classId} does not exist`);
    }

    // Validate all parties exist
    const partyIds = parties.map(p => p.partyId);
    const invalidPartyIds = await this.repository.validatePartiesExist(partyIds);
    if (invalidPartyIds.length > 0) {
      throw new Error(`Parties with IDs ${invalidPartyIds.join(', ')} do not exist`);
    }

    // Create child and get the ID
    const childId = await this.repository.create({
      ...childData,
      classId,
    });

    // Create children_parties join entries
    await this.repository.createChildrenParties(childId, parties);

    return { data: childId };
  }
}
