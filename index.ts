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

export interface Application {
  id?: number;
  jobId: number;
  candidateName: string;
  candidateEmail: string;
  portfolioUrl: string;
  coverLetter: string;
  status?: string;
  appliedAt?: string;
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
