export type NotificationType =
  | "deadline_approaching"
  | "follow_up_reminder"
  | "interview_today"
  | "stale_application"
  | "offer_expiring";

export interface AppNotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  jobId?: string;
  contactId?: string;
  isRead: boolean;
  isDismissed: boolean;
  triggerDate: string;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: "technical" | "behavioral" | "company" | "roleSpecific";
  difficulty: "easy" | "medium" | "hard";
  hint?: string;
  userAnswer?: string;
  isAnswered: boolean;
  source: "ai_generated" | "user_added";
}

export interface OfferDetails {
  offeredSalary?: string;
  negotiatedSalary?: string;
  offerDeadline?: string;
  negotiationNotes?: string;
  decision?: "pending" | "accepted" | "declined" | "negotiating";
}
