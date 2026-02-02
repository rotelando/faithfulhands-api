import { and, count, eq, getTableColumns, ilike, or } from 'drizzle-orm';
import express from 'express';
import { db } from '../db';
import { children, childrenParents, classes, parents } from '../db/schema';

const childrenRoutes = express.Router();

childrenRoutes.get('/', async (req, res) => {
    try {
        const { search, className, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);

        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions = [];

        if (search) {
            filterConditions.push(or(
                ilike(children.firstName, `%${search}%`),
                ilike(children.lastName, `%${search}%`),
            ));
        }

        if (className) {
            filterConditions.push(ilike(classes.name, `%${className}%`));
        }

        // combine all filter conditions
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db
            .select({ count: count() })
            .from(children)
            .leftJoin(classes, eq(children.classId, classes.id))
            .leftJoin(childrenParents, eq(children.id, childrenParents.childId))
            .leftJoin(parents, eq(childrenParents.parentId, parents.id))
            .where(whereClause);

        const totalCount = countResult[0]?.count ?? 0;

        const childrenList = await db.query.children.findMany({
            where: whereClause,
            offset: offset, 
            limit: limitPerPage,
            with: {
                class: true,
                parents: {
                    with: {
                        parent: true,
                    }
                }
            },
        });
        // const childrenList = await db
        //     .select({
        //         ...getTableColumns(children),
        //         class: { ...getTableColumns(classes)},
        //         parents: { ...getTableColumns(parents)},
        //     })
        //     .from(children)
        //     .leftJoin(classes, eq(children.classId, classes.id))
        //     .leftJoin(childrenParents, eq(children.id, childrenParents.childId))
        //     .leftJoin(parents, eq(childrenParents.parentId, parents.id))
        //     .where(whereClause)
        //     .offset(offset)
        //     .limit(limitPerPage);
        
        res.status(200).json({
            data: childrenList,
            pagination: {
                total: totalCount,
                page: currentPage,
                limit: limitPerPage,
            },
        });
    } catch (error) {
        console.error('Error fetching children:', error);
        res.status(500).json({ error: 'Failed to get children' });
    } finally {
        res.end();
    }
});

export default childrenRoutes;