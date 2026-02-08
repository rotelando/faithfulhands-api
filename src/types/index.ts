// Params for requests
export interface GetCareSessionsParams {
    search?: string;
    class?: string; // class code
    date?: string;  // YYYY-MM-DD
    page: number;
    limit: number;
  }
  
  export interface CreateCareSessionParams {
    name: string;
    shortName?: string | null;
    classCode: string;
    serviceDate: Date;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
    children?: {
      childId: number;
      partyId: number;
      relationship: string;
    }[];
  }
  
  export interface GetChildrenParams {
    search?: string;
    class?: string;
    page: number;
    limit: number;
  }
  
  export interface GetCareSessionsResult {
    data: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }

  export interface CreateChildParams {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    allergies?: string | null;
    classId: number;
    parties: Array<{ partyId: number; relationship: string }>;
  }
  
  export interface CareSessionStatus {
    id: number;
    name: string;
  }
  
  // Entities
  export interface CareSession {
    id: string;
    name: string;
    shortName: string | null;
    classId: number;
    class: Class;
    serviceDate: string;
    startDateTime: Date;
    endDateTime: Date;
    status: CareSessionStatus;
    notes: string | null;
  }
  export interface GetCareSessionByIdResult extends CareSession {
    careSessionChildren: CareSessionChild[];
  }

  export interface ChildParty {
    child: Child;
    parties: PartyRelationship[];
  }

  export interface PartyRelationship extends Party {
    relationship: string;
  }

  export interface Party {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date | null;
  }

  export interface Child {
    id: number;
    firstName: string;
    lastName: string;
    class: string;
    dateOfBirth: Date;
    allergies: string | null;
    parties: { partyId: number; relationship: string, firstName: string, lastName: string }[];
    createdAt: Date;
    updatedAt: Date | null;
  }
  
  export interface Class {
    id: number;
    name: string;
    code: string;
    capacity: number;
    description: string | null;
  }

  export interface CareSessionChild {
    child: Child;
    checkedInBy: PartyRelationship;
    checkedOutBy: PartyRelationship | null;
    checkedInAt: Date | null;
    checkedOutAt: Date | null;
    status: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  }
  
  export interface CreateCareSessionResult {
    data: {
      id: string;
    };
  }
  
  export interface GetChildrenResult {
    data: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  }