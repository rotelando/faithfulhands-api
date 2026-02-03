import { relations } from "drizzle-orm";
import { date, index, integer, pgEnum, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { children, classes, staff } from "./app.js";

const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}

// Status enum for attendance_sessions table
export const attendanceSessionStatusEnum = pgEnum('attendance_session_status', ['active', 'picked_up', 'cancelled']);
export const tokenStatusEnum = pgEnum('token_status', ['active', 'used', 'expired', 'revoked']);

export const attendanceSessions = pgTable('attendance_sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    childId: integer('child_id').notNull().references(() => children.id),
    classId: integer('class_id').notNull().references(() => classes.id),
    checkedInAt: timestamp('checked_in_at'),
    checkedOutAt: timestamp('checked_out_at'),
    checkedInBy: integer('checked_in_by').notNull().references(() => staff.id),
    checkedOutBy: integer('checked_out_by').notNull().references(() => staff.id),
    serviceDate: date('date').notNull(),
    status: attendanceSessionStatusEnum('status').notNull().default('active'),
    notes: text('notes'),
    ...timestamps,
}, (table) => ({
    childServiceDateUnique: unique('attendance_sessions_child_date_unique').on(table.childId, table.serviceDate),
    childIdIdx: index('attendance_sessions_child_id_idx').on(table.childId),
    classIdIdx: index('attendance_sessions_class_id_idx').on(table.classId),
    serviceDateIdx: index('attendance_sessions_service_date_idx').on(table.serviceDate),
    statusIdx: index('attendance_sessions_status_idx').on(table.status),
    checkedInAtIdx: index('attendance_sessions_checked_in_at_idx').on(table.checkedInAt),
    checkedOutAtIdx: index('attendance_sessions_checked_out_at_idx').on(table.checkedOutAt),
}));

export const pickupTokens = pgTable('pickup_tokens', {
    id: uuid('id').primaryKey().defaultRandom(),
    attendanceSessionId: uuid('attendance_session_id').notNull().references(() => attendanceSessions.id),
    tokenHash: text('token_hash').notNull().unique(),
    issuedToLabel: text('issued_to_label').notNull(), // MOTHER, FATHER etc.
    issuedAt: timestamp('issued_at').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    usedAt: timestamp('used_at'),
    usedBy: integer('used_by').references(() => staff.id),
    status: tokenStatusEnum('status').notNull().default('active'),
    ...timestamps,
}, (table) => ({
    attendanceSessionIdIdx: index('pickup_tokens_attendance_session_id_idx').on(table.attendanceSessionId),
    tokenHashIdx: index('pickup_tokens_token_hash_idx').on(table.tokenHash),
    statusIdx: index('pickup_tokens_status_idx').on(table.status),
    expiresAtIdx: index('pickup_tokens_expires_at_idx').on(table.expiresAt),
}));

// Relations
export const attendanceSessionsRelations = relations(attendanceSessions, ({ one, many }) => ({
    child: one(children, {
        fields: [attendanceSessions.childId],
        references: [children.id],
    }),
    class: one(classes, {
        fields: [attendanceSessions.classId],
        references: [classes.id],
    }),
    checkedInByStaff: one(staff, {
        fields: [attendanceSessions.checkedInBy],
        references: [staff.id],
    }),
    checkedOutByStaff: one(staff, {
        fields: [attendanceSessions.checkedOutBy],
        references: [staff.id],
    }),
    pickupTokens: many(pickupTokens),
}));

export const pickupTokensRelations = relations(pickupTokens, ({ one }) => ({
    attendanceSession: one(attendanceSessions, {
        fields: [pickupTokens.attendanceSessionId],
        references: [attendanceSessions.id],
    }),
    usedByStaff: one(staff, {
        fields: [pickupTokens.usedBy],
        references: [staff.id],
    }),
}));

// Type exports
export type AttendanceSession = typeof attendanceSessions.$inferSelect;
export type NewAttendanceSession = typeof attendanceSessions.$inferInsert;

export type PickupToken = typeof pickupTokens.$inferSelect;
export type NewPickupToken = typeof pickupTokens.$inferInsert;

