export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  remote: boolean;
  sponsorship: boolean;
  description: string;
  salary: string;
}

export type ApplicationStage =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN";

export interface Application {
  id?: number;
  jobId: number;
  candidateName: string;
  candidateEmail: string;
  portfolioUrl: string;
  coverLetter: string;
  /** Mirrors `stage`; kept for existing views that read a plain string. */
  status?: string;
  appliedAt?: string;

  // ATS pipeline fields, populated by the backend.
  stage?: ApplicationStage;
  rating?: number | null;
  matchScore?: number | null;
  assignedTo?: string | null;
  skills?: string;
  resumeText?: string;
  resumeUrl?: string;
  rejectionReason?: string | null;
  stageChangedAt?: string;
  updatedAt?: string;
}

export interface StageDescriptor {
  name: ApplicationStage;
  label: string;
  terminal: boolean;
  active: boolean;
}

export interface ApplicationEvent {
  id: number;
  applicationId: number;
  fromStage: ApplicationStage | null;
  toStage: ApplicationStage;
  actor: string;
  note?: string | null;
  occurredAt: string;
}

export interface ApplicationNote {
  id: number;
  applicationId: number;
  author: string;
  body: string;
  createdAt: string;
}

export interface PipelineFunnel {
  jobId: number;
  totalApplications: number;
  byStage: Record<ApplicationStage, number>;
  conversionRates: Record<ApplicationStage, number>;
  strongMatches: number;
  awaitingReview: number;
  strongMatchThreshold: number;
}

export interface MatchBreakdown {
  applicationId: number;
  score: number;
  strongMatch: boolean;
  matched: string[];
  missing: string[];
}

export interface StudentProfile {
  id?: number;
  userId: string;
  fullName: string;
  headline: string;
  school: string;
  major: string;
  gradYear: string;
  location: string;
  avatarUrl?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  bio: string;
  skills: string;
  openToWork: boolean;
  publicProfile: boolean;
}

export interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  size: string;
  website: string;
  logoUrl?: string;
  sponsorsVisas: boolean;
  description: string;
}

export interface Event {
  id: number;
  title: string;
  host: string;
  type: string;
  date: string;
  time: string;
  virtual: boolean;
  location: string;
  bannerUrl?: string;
  description: string;
}

export interface EventRegistration {
  id?: number;
  eventId?: number;
  userId?: string;
  attendeeName: string;
  attendeeEmail: string;
  registeredAt?: string;
}

export interface Message {
  id?: number;
  threadId?: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  body: string;
  read?: boolean;
  sentAt?: string;
}
