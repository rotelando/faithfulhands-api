import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { db } from '../db/index.js';
import { parties, partyRoles, roles } from '../db/schema/index.js';

export class PartiesRepository {
  /**
   * Count total parties matching the where clause with required joins
   * Uses DISTINCT to handle cases where joins might create duplicates
   */
  async count(whereClause: SQL | undefined): Promise<number> {
    let query = db
      .selectDistinct({ id: parties.id, createdAt: parties.createdAt })
      .from(parties)
      .leftJoin(partyRoles, eq(parties.id, partyRoles.partyId))
      .leftJoin(roles, eq(partyRoles.roleId, roles.id));

    const countResult = await (whereClause ? query.where(whereClause) : query);

    return Number(countResult.length ?? 0);
  }

  /**
   * Find parties with pagination, relations, and ordering
   * Returns party fields plus nested children objects
   */
  async findMany(
    whereClause: SQL | undefined,
    offset: number,
    limit: number
  ) {
    // Base query with joins for role filtering
    const baseQuery = db
      .selectDistinct({ id: parties.id, createdAt: parties.createdAt })
      .from(parties)
      .leftJoin(partyRoles, eq(parties.id, partyRoles.partyId))
      .leftJoin(roles, eq(partyRoles.roleId, roles.id));

    // Apply filters if provided
    const filteredQuery = whereClause ? baseQuery.where(whereClause) : baseQuery;

    // Get distinct party IDs first to handle pagination correctly with proper ordering
    const partyIdsResult = await filteredQuery
      .orderBy(desc(parties.createdAt))
      .limit(limit)
      .offset(offset);

    const partyIds = partyIdsResult.map((row) => row.id);

    if (partyIds.length === 0) {
      return [];
    }

    // Fetch full party data with nested children using relational query
    // Preserve order by mapping results back to the original order
    const partiesData = await db.query.parties.findMany({
      where: (parties, { inArray }) => inArray(parties.id, partyIds),
    });

    // Map results back to preserve the original order
    const partiesMap = new Map(partiesData.map(p => [p.id, p]));
    return partyIds.map(id => partiesMap.get(id)).filter(Boolean) as typeof partiesData;
  }

  /**
   * Build where clause for parties based on search, role, and active flag
   */
  buildWhereClause(
    search?: string,
    role?: 'guardian' | 'staff',
    onlyActive?: boolean
  ): SQL | undefined {
    const filterConditions: SQL[] = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(parties.firstName, `%${search}%`),
          ilike(parties.lastName, `%${search}%`),
          ilike(parties.email, `%${search}%`)
        ) as SQL
      );
    }

    if (typeof onlyActive === 'boolean' && onlyActive) {
      filterConditions.push(eq(parties.isActive, true));
    }

    if (role) {
      filterConditions.push(eq(roles.name, role));
    }

    return filterConditions.length > 0 ? and(...filterConditions) : undefined;
  }
}
