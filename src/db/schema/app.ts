import { relations } from "drizzle-orm";
import { boolean, date, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth";

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

export const parties = pgTable('parties', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    gender: varchar('gender', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 255 }).notNull(),
    isActive: boolean('is_active').notNull().default(true),
    userId: text('user_id').references(() => user.id),
    ...timestamps,
});

export const roles = pgTable('roles', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    ...timestamps,
});

export const partyRoles = pgTable('party_roles', {
    id: serial('id').primaryKey(),
    partyId: integer('party_id').references(() => parties.id),
    roleId: integer('role_id').references(() => roles.id),
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

export const childrenParties = pgTable('children_parties', {
    id: serial('id').primaryKey(),
    childId: integer('child_id').references(() => children.id),
    partyId: integer('party_id').references(() => parties.id),
    relationship: varchar('relationship', { length: 255 }).notNull(),
    ...timestamps,
});

export const classRelations = relations(classes, ({many}) => ({children: many(children)}))

export const partyRelations = relations(parties, ({many}) => ({children: many(childrenParties)}))

export const childRelations = relations(children, ({one, many}) => ({
    class: one(classes, {
        fields: [children.classId],
        references: [classes.id],
    }),
    parties: many(childrenParties),
}));

export const childrenPartiesRelations = relations(childrenParties, ({one}) => ({
    child: one(children, {
        fields: [childrenParties.childId],
        references: [children.id],
    }),
    party: one(parties, {
        fields: [childrenParties.partyId],
        references: [parties.id],
    }),
}));

export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;

export type Party = typeof parties.$inferSelect;
export type NewParty = typeof parties.$inferInsert;

export type Children = typeof children.$inferSelect;
export type NewChildren = typeof children.$inferInsert;

export type ChildrenParty = typeof childrenParties.$inferSelect;
export type NewChildrenParty = typeof childrenParties.$inferInsert;