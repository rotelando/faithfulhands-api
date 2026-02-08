import type {
  DBChild,
  DBChildParty,
  DBCareSessionEntity,
  DBParty,
  DBClass,
} from "../repositories/types.js";
import type {
  CareSessionChild,
  Child,
  ChildParty,
  Class,
  GetCareSessionByIdResult,
  Party,
  PartyRelationship,
} from "../types/index.js";

/** Maps DBParty to domain Party. */
function mapDBPartyToParty(db: DBParty): Party {
  return {
    id: db.id,
    firstName: db.firstName,
    lastName: db.lastName,
    email: db.email,
    phone: db.phone,
    gender: db.gender,
    isActive: db.isActive,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  };
}

/** Maps DBChild (with class relation) to domain Child. */
function mapDBChildToChild(db: DBChild): Child {
  return {
    id: db.id,
    firstName: db.firstName,
    lastName: db.lastName,
    class: db.class.name,
    dateOfBirth: new Date(db.dateOfBirth),
    allergies: db.allergies,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
    parties: db.parties.map(p => ({ partyId: p.partyId, relationship: p.relationship, firstName: p.party.firstName, lastName: p.party.lastName })),
  };
}

/**
 * Maps DBCareSessionEntity (findFirst result) to GetCareSessionByIdResult.
 * Groups children by child id; each ChildParty has a unique list of parties
 * (from checkedInBy and checkedOutBy) and relationship from notes.
 */
export function mapDBCareSessionEntityToGetByIdResult(
  db: DBCareSessionEntity,
): GetCareSessionByIdResult {
  const childrenGrouped = groupDBChildPartiesByChild(db.children);

  const serviceDate =
    typeof db.serviceDate === "string"
      ? db.serviceDate
      : (db.serviceDate as Date).toISOString().split("T")[0]!;

  return {
    id: db.id,
    name: db.name,
    shortName: db.shortName,
    classId: db.classId,
    serviceDate,
    startDateTime: db.startTime,
    endDateTime: db.endTime,
    status: {
      id: db.status.id,
      name: db.status.name ?? "",
    },
    notes: db.notes,
    class: mapDBClassToClass(db.class),
    careSessionChildren: childrenGrouped,
  };
}

/**
 * Groups flat DBChildParty[] by child id. For each child, builds one ChildParty
 * with parties = unique list of Party (checkedInBy + checkedOutBy) and
 * relationship = notes (first row for that child).
 */
function groupDBChildPartiesByChild(children: DBChildParty[]): CareSessionChild[] {
  const result: CareSessionChild[] = [];

  for (const rowChild of children) {
    result.push({
      child: mapDBChildToChild(rowChild.child),
      checkedInBy: mapDBPartyToPartyRelationship(rowChild.checkedInBy, rowChild.child),
      checkedInAt: rowChild.checkedInAt,
      checkedOutBy: rowChild.checkedOutBy ? mapDBPartyToPartyRelationship(rowChild.checkedOutBy, rowChild.child) : null,
      checkedOutAt: rowChild.checkedOutAt ?? null,
      status: rowChild.status.name,
      notes: rowChild.notes ?? "",
      createdAt: rowChild.createdAt,
      updatedAt: rowChild.updatedAt ?? null,
    });  
  }

  return result;
}
function mapDBPartyToPartyRelationship(db: DBParty, child: DBChild): PartyRelationship {
  console.log(child.parties);
  const relationship = child.parties.find(p => p.partyId === db.id)?.relationship;
  return {
    ...mapDBPartyToParty(db),
    relationship: relationship ?? "",
  };
}

function mapDBClassToClass(dbClass: DBClass): Class {
  return {
    id: dbClass.id,
    name: dbClass.name,
    code: dbClass.code,
    capacity: dbClass.capacity,
    description: dbClass.description ?? "",
  };
}

