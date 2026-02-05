import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  careSessions,
  careSessionsChildren,
  careSessionStatuses,
  classes,
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
}

