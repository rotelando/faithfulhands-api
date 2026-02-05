import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  careSessions,
  careSessionsChildren,
  careSessionStatuses,
  classes,
  children,
} from "../db/schema/index.js";

export class CareSessionsRepository {
  /**
   * Count total care sessions matching the where clause
   * Uses DISTINCT to handle duplicates from joins.
   */
  async count(whereClause: SQL | undefined): Promise<number> {
    let query = db
      .selectDistinct({ id: careSessions.id })
      .from(careSessions)
      .leftJoin(classes, eq(careSessions.classId, classes.id))
      .leftJoin(careSessionStatuses, eq(careSessions.status, careSessionStatuses.id));

    const result = await (whereClause ? query.where(whereClause) : query);

    return result.length ?? 0;
  }

  /**
   * Find care sessions with pagination, relations, and ordering
   * Returns care session fields plus related class, status and children.
   */
  async findMany(
    whereClause: SQL | undefined,
    offset: number,
    limit: number,
  ) {
    const baseQuery = db
      .selectDistinct({
        id: careSessions.id,
        serviceDate: careSessions.serviceDate,
        startTime: careSessions.startTime,
      })
      .from(careSessions)
      .leftJoin(classes, eq(careSessions.classId, classes.id))
      .leftJoin(careSessionStatuses, eq(careSessions.status, careSessionStatuses.id));

    const filteredQuery = whereClause ? baseQuery.where(whereClause) : baseQuery;

    const idRows = await filteredQuery
      .orderBy(desc(careSessions.serviceDate), desc(careSessions.startTime))
      .limit(limit)
      .offset(offset);

    const ids = idRows.map((row) => row.id);

    if (ids.length === 0) {
      return [];
    }

    // Fetch full records with relations and then preserve ordering
    const sessions = await db.query.careSessions.findMany({
      where: (cs, { inArray }) => inArray(cs.id, ids),
      with: {
        class: true,
        status: true,
        children: {
          with: {
            child: true,
          },
        },
      },
    });

    const map = new Map(sessions.map((s) => [s.id, s]));
    return ids.map((id) => map.get(id)).filter(Boolean) as typeof sessions;
  }

  /**
   * Build where clause based on search, class code and service date.
   */
  buildWhereClause(
    search?: string,
    classCode?: string,
    serviceDate?: string,
  ): SQL | undefined {
    const filters: SQL[] = [];

    if (search) {
      filters.push(
        or(
          ilike(careSessions.name, `%${search}%`),
          ilike(careSessions.shortName, `%${search}%`),
          ilike(classes.code, `%${search}%`),
        ) as SQL,
      );
    }

    if (classCode) {
      filters.push(eq(classes.code, classCode));
    }

    if (serviceDate) {
      filters.push(eq(careSessions.serviceDate, serviceDate));
    }

    return filters.length > 0 ? and(...filters) : undefined;
  }

  /**
   * Resolve class ID by class code.
   */
  async findClassIdByCode(code: string): Promise<number | null> {
    const rows = await db
      .select({ id: classes.id })
      .from(classes)
      .where(eq(classes.code, code))
      .limit(1);

    return rows[0]?.id ?? null;
  }

  /**
   * Validate that given children IDs exist.
   * Returns IDs that do NOT exist.
   */
  async findMissingChildrenIds(ids: number[]): Promise<number[]> {
    if (!ids.length) return [];

    const existing = await db
      .select({ id: children.id })
      .from(children)
      .where(sql`${children.id} = ANY(${sql.join(ids, sql`,`)})`);

    const existingIds = new Set(existing.map((r) => r.id));
    return ids.filter((id) => !existingIds.has(id));
  }

  /**
   * Find the default ACTIVE care session status id.
   */
  async getActiveStatusId(): Promise<number> {
    const rows = await db
      .select({ id: careSessionStatuses.id })
      .from(careSessionStatuses)
      .where(eq(careSessionStatuses.name, "active"))
      .limit(1);

    if (!rows[0]) {
      throw new Error("Active care session status not configured");
    }
    return rows[0].id;
  }

  /**
   * Create a new care session and return its id.
   */
  async createCareSession(data: {
    name: string;
    shortName?: string | null;
    classId: number;
    serviceDate: string; // YYYY-MM-DD
    startDateTime: Date;
    endDateTime: Date;
  }): Promise<string> {
    const statusId = await this.getActiveStatusId();

    const rows = await db
      .insert(careSessions)
      .values({
        name: data.name,
        shortName: data.shortName ?? null,
        classId: data.classId,
        serviceDate: data.serviceDate,
        startTime: data.startDateTime,
        endTime: data.endDateTime,
        status: statusId,
      })
      .returning({ id: careSessions.id });

    return rows[0]!.id;
  }

  /**
   * Create children links for a care session.
   */
  async createCareSessionsChildren(
    careSessionId: string,
    children: {
      childId: number;
      partyId: number;
      relationship: string;
    }[],
  ): Promise<void> {
    if (!children.length) return;

    const rows = await db
      .select({ id: careSessionsChildren.id })
      .from(careSessionsChildren)
      .limit(0); // just to ensure type; not used

    // Set default status as ACTIVE for care_sessions_children
    // For simplicity, use status id 1 (seeded as 'active'); could also query like getActiveStatusId for child statuses.
    const activeChildStatusId = 1;

    await db.insert(careSessionsChildren).values(
      children.map((child) => ({
        careSessionId,
        childId: child.childId,
        partyId: child.partyId,
        relationship: child.relationship,
        status: activeChildStatusId,
        checkedInBy: child.partyId,
        checkedInAt: new Date(),
      })),
    );
  }
}

