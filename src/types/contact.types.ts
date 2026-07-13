export type MeetingType = "google_meet" | "zoom" | "teams" | "offline" | "other";

export interface Contact {
  _id: string;
  userId: string;
  name: string;
  role: string;
  company: string;
  email?: string;
  meetingLink?: string;
  meetingType?: MeetingType;
  meetingLocationUrl?: string;
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
  meetingLink?: string;
  meetingType?: MeetingType;
  meetingLocationUrl?: string;
  phone?: string;
  linkedJobIds?: string[];
  notes?: string;
  lastContactDate?: string;
  followUpDate?: string;
  relationship?: Contact["relationship"];
}
