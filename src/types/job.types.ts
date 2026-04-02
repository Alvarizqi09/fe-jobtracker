import type { ActivityEvent } from './analytics.types';
import type { InterviewQuestion, OfferDetails } from './notification.types';

export type JobStatus =
  | "wishlist"
  | "applied"
  | "online_test"
  | "interview"
  | "offer"
  | "rejected";
export type JobPriority = "low" | "medium" | "high";
export type TestType = "online_test" | "psikotest" | "intelligence" | "technical" | "assessment" | "other";

export interface Job {
  _id: string;
  userId: string;
  company: string;
  position: string;
  status: JobStatus;
  priority: JobPriority;
  salary?: string;
  testType?: TestType;
  location?: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  appliedDate?: string;
  deadline?: string;
  tags?: string[];
  order: number;
  activityLog?: ActivityEvent[];
  interviewQuestions?: InterviewQuestion[];
  offerDetails?: OfferDetails;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobDTO {
  company: string;
  position: string;
  status: JobStatus;
  priority: JobPriority;
  salary?: string;
  testType?: TestType;
  location?: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  appliedDate?: string;
  deadline?: string;
  tags?: string[];
}

export interface UpdateJobStatusDTO {
  status: JobStatus;
  order: number;
}

export interface KanbanColumn {
  id: JobStatus;
  title: string;
  color: string;
  jobs: Job[];
}

