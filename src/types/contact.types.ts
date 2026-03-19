export interface Contact {
  _id: string;
  userId: string;
  name: string;
  role: string;
  company: string;
  email?: string;
  linkedin?: string;
  phone?: string;
  linkedJobIds: string[];
  notes?: string;
  lastContactDate?: string;
  followUpDate?: string;
  relationship:
    | "recruiter"
    | "interviewer"
    | "referral"
    | "connection"
    | "other";
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactDTO {
  name: string;
  role: string;
  company: string;
  email?: string;
  linkedin?: string;
  phone?: string;
  linkedJobIds?: string[];
  notes?: string;
  lastContactDate?: string;
  followUpDate?: string;
  relationship?: Contact["relationship"];
}
