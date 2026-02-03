import { and, desc, ilike, or, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { db } from '../db/index.js';
import { classes } from '../db/schema/index.js';

export class ClassesRepository {
  /**
   * Count total classes matching the where clause
   */
  async count(whereClause: SQL | undefined): Promise<number> {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(classes)
      .where(whereClause);

    return Number(countResult[0]?.count ?? 0);
  }

  /**
   * Find classes with pagination and ordering
   * Returns class fields
   */
  async findMany(
    whereClause: SQL | undefined,
    offset: number,
    limit: number
  ) {
    return await db.query.classes.findMany({
      where: whereClause,
      offset: offset,
      limit: limit,
      orderBy: [desc(classes.createdAt)],
    });
  }

  /**
   * Build where clause for classes based on search
   */
  buildWhereClause(search?: string): SQL | undefined {
    const filterConditions = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(classes.name, `%${search}%`),
          ilike(classes.code, `%${search}%`)
        )
      );
    }

    return filterConditions.length > 0 ? and(...filterConditions) : undefined;
  }
}
