import { and, count, ilike, inArray, or } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { db } from '../db/index.js';
import { children, classes } from '../db/schema/index.js';

export class ChildrenRepository {
  /**
   * Find class IDs by class name (case-insensitive search)
   */
  async findClassIdsByName(className: string): Promise<number[]> {
    const matchingClasses = await db
      .select({ id: classes.id })
      .from(classes)
      .where(ilike(classes.name, `%${className}%`));
    
    return matchingClasses.map(c => c.id);
  }

  /**
   * Count total children matching the where clause
   */
  async count(whereClause: SQL | undefined): Promise<number> {
    const countResult = await db
      .select({ count: count() })
      .from(children)
      .where(whereClause);

    return countResult[0]?.count ?? 0;
  }

  /**
   * Find children with pagination and relations
   */
  async findMany(
    whereClause: SQL | undefined,
    offset: number,
    limit: number
  ) {
    return await db.query.children.findMany({
      where: whereClause,
      offset: offset,
      limit: limit,
      with: {
        class: true,
        guardians: {
          with: {
            guardian: true,
          },
        },
      },
    });
  }

  /**
   * Build where clause for children based on search and class IDs
   */
  buildWhereClause(search?: string, classIds?: number[]): SQL | undefined {
    const filterConditions = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(children.firstName, `%${search}%`),
          ilike(children.lastName, `%${search}%`)
        )
      );
    }

    if (classIds && classIds.length > 0) {
      filterConditions.push(inArray(children.classId, classIds));
    }

    return filterConditions.length > 0 ? and(...filterConditions) : undefined;
  }
}
