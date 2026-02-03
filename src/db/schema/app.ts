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

export const guardians = pgTable('guardians', {
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
    allergies: varchar('allergies', { length: 255 }),
    classId: integer('class_id').notNull().references(() => classes.id),
    ...timestamps,
});

export const childrenGuardians = pgTable('children_guardians', {
    id: serial('id').primaryKey(),
    childId: integer('child_id').references(() => children.id),
    guardianId: integer('guardian_id').references(() => guardians.id),
    relationship: varchar('relationship', { length: 255 }).notNull(),
    ...timestamps,
});

export const classRelations = relations(classes, ({many}) => ({children: many(children)}))

export const guardianRelations = relations(guardians, ({many}) => ({children: many(childrenGuardians)}))

export const childRelations = relations(children, ({one, many}) => ({
    class: one(classes, {
        fields: [children.classId],
        references: [classes.id],
    }),
    guardians: many(childrenGuardians),
}));

export const childrenGuardiansRelations = relations(childrenGuardians, ({one}) => ({
    child: one(children, {
        fields: [childrenGuardians.childId],
        references: [children.id],
    }),
    guardian: one(guardians, {
        fields: [childrenGuardians.guardianId],
        references: [guardians.id],
    }),
}));

export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;

export type Guardian = typeof guardians.$inferSelect;
export type NewGuardian = typeof guardians.$inferInsert;

export type Children = typeof children.$inferSelect;
export type NewChildren = typeof children.$inferInsert;

export type ChildrenGuardian = typeof childrenGuardians.$inferSelect;
export type NewChildrenGuardian = typeof childrenGuardians.$inferInsert;