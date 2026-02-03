import { and, count, eq, ilike, inArray, or } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { db } from '../db/index.js';
import { children, classes, parties, childrenParties } from '../db/schema/index.js';

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
        parties: {
          with: {
            party: true,
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

  /**
   * Validate that a class ID exists in the database
   */
  async validateClassExists(classId: number): Promise<boolean> {
    const result = await db
      .select({ id: classes.id })
      .from(classes)
      .where(eq(classes.id, classId))
      .limit(1);

    return result.length > 0;
  }

  /**
   * Validate that all party IDs exist in the database
   * Returns the party IDs that don't exist
   */
  async validatePartiesExist(partyIds: number[]): Promise<number[]> {
    if (partyIds.length === 0) {
      return [];
    }

    const existingParties = await db
      .select({ id: parties.id })
      .from(parties)
      .where(inArray(parties.id, partyIds));

    const existingIds = new Set(existingParties.map(p => p.id));
    return partyIds.filter(id => !existingIds.has(id));
  }

  /**
   * Create a new child and return the created child's ID
   */
  async create(data: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date | string;
    allergies?: string | null;
    classId: number;
  }): Promise<number> {
    // Convert Date to YYYY-MM-DD string format for PostgreSQL date column
    let dateString: string;
    if (data.dateOfBirth instanceof Date) {
      dateString = data.dateOfBirth.toISOString().split('T')[0]!;
    } else {
      dateString = String(data.dateOfBirth);
    }

    const result = await db
      .insert(children)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: dateString,
        allergies: data.allergies || null,
        classId: data.classId,
      })
      .returning({ id: children.id });

    return result[0]!.id;
  }

  /**
   * Create children_parties join entries
   */
  async createChildrenParties(
    childId: number,
    partiesData: Array<{ partyId: number; relationship: string }>
  ): Promise<void> {
    if (partiesData.length === 0) {
      return;
    }

    await db.insert(childrenParties).values(
      partiesData.map(p => ({
        childId,
        partyId: p.partyId,
        relationship: p.relationship,
      }))
    );
  }
}
