import { relations } from "drizzle-orm";
import { date, index, integer, pgTable, serial, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { children, classes, parties } from "./app.js";

const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}


export const tokenStatuses = pgTable('token_statuses', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }),
    ...timestamps,
}, (table) => ({
    nameIdx: index('token_statuses_name_idx').on(table.name),
    nameUnique: unique('token_statuses_name_unique').on(table.name),
}));

export const careSessionStatuses = pgTable('care_session_statuses', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }),
    ...timestamps,
}, (table) => ({
    nameIdx: index('care_session_statuses_name_idx').on(table.name),
    nameUnique: unique('care_session_statuses_name_unique').on(table.name),
}));

export const careSessionsChildrenStatuses = pgTable('care_sessions_children_statuses', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }),
    ...timestamps,
}, (table) => ({
    nameIdx: index('care_sessions_children_statuses_name_idx').on(table.name),
    nameUnique: unique('care_sessions_children_statuses_name_unique').on(table.name),
}));

export const careSessions = pgTable('care_sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    shortName: varchar('short_name', { length: 100 }),
    classId: integer('class_id').notNull().references(() => classes.id),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    status: integer('care_session_status_id').notNull().references(() => careSessionStatuses.id),
    serviceDate: date('date').notNull(),
    notes: text('notes'),
    ...timestamps,
}, (table) => ({
    classIdIdx: index('care_sessions_class_id_idx').on(table.classId),
    serviceDateIdx: index('care_sessions_service_date_idx').on(table.serviceDate),
    statusIdx: index('care_sessions_status_idx').on(table.status),
}));

export const careSessionsChildren = pgTable('care_sessions_children', {
    id: uuid('id').primaryKey().defaultRandom(),
    careSessionId: uuid('care_session_id').notNull().references(() => careSessions.id),
    childId: integer('child_id').notNull().references(() => children.id),
    checkedInAt: timestamp('checked_in_at').notNull(),
    checkedInBy: integer('checked_in_by').notNull().references(() => parties.id),
    checkedOutAt: timestamp('checked_out_at'),
    checkedOutBy: integer('checked_out_by').references(() => parties.id),
    status: integer('care_sessions_children_status_id').notNull().references(() => careSessionsChildrenStatuses.id),
    notes: text('notes'),
    ...timestamps,
}, (table) => ({
    careSessionIdIdx: index('care_sessions_children_care_session_id_idx').on(table.careSessionId),
    childIdIdx: index('care_sessions_children_child_id_idx').on(table.childId),
    statusIdx: index('care_sessions_children_status_idx').on(table.status),
    checkedInAtIdx: index('care_sessions_children_checked_in_at_idx').on(table.checkedInAt),
    checkedOutAtIdx: index('care_sessions_children_checked_out_at_idx').on(table.checkedOutAt),
}));

export const pickupTokens = pgTable('pickup_tokens', {
    id: uuid('id').primaryKey().defaultRandom(),
    careSessionChildrenId: uuid('care_session_children_id').notNull().references(() => careSessionsChildren.id),
    tokenHash: text('token_hash').notNull().unique(),
    issuedToLabel: text('issued_to_label').notNull(), // MOTHER, FATHER etc.
    issuedAt: timestamp('issued_at').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    usedAt: timestamp('used_at'),
    usedBy: integer('used_by').references(() => parties.id),
    status: integer('status').notNull().references(() => tokenStatuses.id),
    ...timestamps,
}, (table) => ({
    careSessionChildrenIdIdx: index('pickup_tokens_care_session_children_id_idx').on(table.careSessionChildrenId),
    tokenHashIdx: index('pickup_tokens_token_hash_idx').on(table.tokenHash),
    statusIdx: index('pickup_tokens_status_idx').on(table.status),
    expiresAtIdx: index('pickup_tokens_expires_at_idx').on(table.expiresAt),
}));

// Relations

export const careSessionsChildrenRelations = relations(careSessionsChildren, ({ one, many }) => ({
    careSession: one(careSessions, {
        fields: [careSessionsChildren.careSessionId],
        references: [careSessions.id],
    }),
    child: one(children, {
        fields: [careSessionsChildren.childId],
        references: [children.id],
    }),
    status: one(careSessionsChildrenStatuses, {
        fields: [careSessionsChildren.status],
        references: [careSessionsChildrenStatuses.id],
    }),
    pickupTokens: many(pickupTokens),
    checkedInBy: one(parties, {
        fields: [careSessionsChildren.checkedInBy],
        references: [parties.id],
    }),
    checkedOutBy: one(parties, {
        fields: [careSessionsChildren.checkedOutBy],
        references: [parties.id],
    }),
}));

export const careSessionsRelations = relations(careSessions, ({ one, many }) => ({
    status: one(careSessionStatuses, {
        fields: [careSessions.status],
        references: [careSessionStatuses.id],
    }),
    class: one(classes, {
        fields: [careSessions.classId],
        references: [classes.id],
    }),
    children: many(careSessionsChildren),
}));

export const pickupTokensRelations = relations(pickupTokens, ({ one }) => ({
    careSessionChildren: one(careSessionsChildren, {
        fields: [pickupTokens.careSessionChildrenId],
        references: [careSessionsChildren.id],
    }),
    status: one(tokenStatuses, {
        fields: [pickupTokens.status],
        references: [tokenStatuses.id],
    }),
}));
