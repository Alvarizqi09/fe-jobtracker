import type { JobStatus, JobPriority } from "./job.types";

export interface MonthlyData {
  month: string;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}

export interface WeeklyData {
  week: string;
  count: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface SalaryRange {
  range: string;
  count: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface JobStats {
  total: number;
  byStatus: Record<string, number>;
  monthlyApplications: MonthlyData[];
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  avgDaysToResponse: number;
  mostAppliedTags: TagCount[];
  salaryDistribution: SalaryRange[];
}

export interface ActivityEvent {
  _id: string;
  type:
    | "status_changed"
    | "note_added"
    | "cover_letter_generated"
    | "created"
    | "edited";
  description: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface TimelineEvent {
  _id: string;
  jobId: string;
  company: string;
  position: string;
  type: string;
  description: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
  status: string;
}

export interface SearchFilters {
  query: string;
  status: JobStatus[];
  priority: JobPriority[];
  tags: string[];
  dateRange: { from: string; to: string } | null;
  location: string;
}
