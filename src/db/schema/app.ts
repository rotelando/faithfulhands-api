import { relations } from "drizzle-orm";
import { date, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 4 }).notNull().unique(),
  capacity: integer('capacity').notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  ...timestamps,
});

export const parents = pgTable('parents', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    gender: varchar('gender', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 255 }).notNull(),
    ...timestamps,
});

export const staff = pgTable('staff', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    gender: varchar('gender', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 255 }).notNull(),
    ...timestamps,
});

export const children = pgTable('children', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    gender: varchar('gender', { length: 255 }).notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    allergies: varchar('allergies', { length: 255 }).notNull(),
    classId: integer('class_id').notNull().references(() => classes.id),
    ...timestamps,
});

export const childrenParents = pgTable('children_parents', {
    id: serial('id').primaryKey(),
    childId: integer('child_id').references(() => children.id),
    parentId: integer('parent_id').references(() => parents.id),
    relationship: varchar('relationship', { length: 255 }).notNull(),
    ...timestamps,
});

export const classRelations = relations(classes, ({many}) => ({children: many(children)}))

export const parentRelations = relations(parents, ({many}) => ({children: many(children)}))

export const childRelations = relations(children, ({one, many}) => ({
    class: one(classes, {
        fields: [children.classId],
        references: [classes.id],
    }),
    parents: many(childrenParents),
}));

export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;

export type Parent = typeof parents.$inferSelect;
export type NewParent = typeof parents.$inferInsert;

export type Child = typeof children.$inferSelect;
export type NewChild = typeof children.$inferInsert;

export type ChildrenParent = typeof childrenParents.$inferSelect;
export type NewChildrenParent = typeof childrenParents.$inferInsert;