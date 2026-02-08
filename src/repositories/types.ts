/**
 * DB types matching the return shape of db.query.careSessions.findFirst(...)
 * with: { class: true, status: true, children: { with: { child: { with: { class: true } }, status: true, checkedInBy: true, checkedOutBy: true } } }
 * Relation keys match Drizzle schema: class, status, children; child, status, checkedInBy, checkedOutBy.
 */

export interface DBStatus {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBClass {
  id: number;
  name: string;
  code: string;
  capacity: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBCareSessionEntity {
  id: string;
  name: string;
  shortName: string | null;
  classId: number;
  startTime: Date;
  endTime: Date;
  serviceDate: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  class: DBClass;
  status: DBStatus;
  children: DBChildParty[];
}

export interface DBChild {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string; // YYYY-MM-DD
  allergies: string | null;
  classId: number;
  createdAt: Date;
  updatedAt: Date;
  class: DBClass;
  parties: { partyId: number; relationship: string, party: DBParty }[];
}

export interface DBParty {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  isActive: boolean;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBChildParty {
  id: string;
  careSessionId: string;
  childId: number;
  checkedInAt: Date | null;
  checkedOutAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  child: DBChild;
  status: DBStatus;
  checkedInBy: DBParty;
  checkedOutBy: DBParty | null;
}
