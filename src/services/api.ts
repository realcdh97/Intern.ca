import {
  Job,
  Application,
  ApplicationEvent,
  ApplicationNote,
  ApplicationStage,
  MatchBreakdown,
  PipelineFunnel,
  StageDescriptor,
  StudentProfile,
  Company,
  Event,
  EventRegistration,
  Message,
} from "@/types";

const API_BASE_URL = "http://localhost:8080/api";

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
}

export const api = {
  jobs: {
    getAll: async (
      filters: { remote?: boolean; sponsorship?: boolean; type?: string } = {}
    ): Promise<Job[]> => {
      const params = new URLSearchParams();
      if (filters.remote) params.append("remote", "true");
      if (filters.sponsorship) params.append("sponsorship", "true");
      if (filters.type) params.append("type", filters.type);
      return get<Job[]>(`/jobs?${params.toString()}`);
    },
    create: (job: Omit<Job, "id">): Promise<Job> => post<Job>("/jobs", job),
  },
  applications: {
    submit: (application: Application): Promise<Application> =>
      post<Application>("/applications", application),
    getByJob: (jobId: number): Promise<Application[]> =>
      get<Application[]>(`/applications/job/${jobId}`),
  },
  profiles: {
    getPublic: (): Promise<StudentProfile[]> => get<StudentProfile[]>("/profiles"),
    getByUser: (userId: string): Promise<StudentProfile> =>
      get<StudentProfile>(`/profiles/${userId}`),
    save: (profile: StudentProfile): Promise<StudentProfile> =>
      post<StudentProfile>("/profiles", profile),
  },
  companies: {
    getAll: (): Promise<Company[]> => get<Company[]>("/companies"),
    getById: (id: number): Promise<Company> => get<Company>(`/companies/${id}`),
    create: (company: Omit<Company, "id">): Promise<Company> =>
      post<Company>("/companies", company),
  },
  events: {
    getAll: (): Promise<Event[]> => get<Event[]>("/events"),
    getById: (id: number): Promise<Event> => get<Event>(`/events/${id}`),
    create: (event: Omit<Event, "id">): Promise<Event> => post<Event>("/events", event),
    register: (id: number, registration: EventRegistration): Promise<EventRegistration> =>
      post<EventRegistration>(`/events/${id}/register`, registration),
    registrationCount: (id: number): Promise<{ count: number }> =>
      get<{ count: number }>(`/events/${id}/registrations/count`),
  },
  messages: {
    getThread: (threadId: string): Promise<Message[]> =>
      get<Message[]>(`/messages/thread/${threadId}`),
    getInbox: (userId: string): Promise<Message[]> =>
      get<Message[]>(`/messages/inbox/${userId}`),
    send: (message: Message): Promise<Message> => post<Message>("/messages", message),
  },
  analytics: {
    getOverview: () => get<Record<string, unknown>>("/analytics/overview"),
  },
  ats: {
    /** Stage columns to render, in pipeline order. */
    stages: (): Promise<StageDescriptor[]> => get<StageDescriptor[]>("/ats/stages"),

    // Per-job views
    board: (jobId: number): Promise<Record<ApplicationStage, Application[]>> =>
      get<Record<ApplicationStage, Application[]>>(`/ats/jobs/${jobId}/board`),
    ranked: (jobId: number): Promise<Application[]> =>
      get<Application[]>(`/ats/jobs/${jobId}/ranked`),
    byStage: (jobId: number, stage: ApplicationStage): Promise<Application[]> =>
      get<Application[]>(`/ats/jobs/${jobId}/stage/${stage}`),
    funnel: (jobId: number): Promise<PipelineFunnel> =>
      get<PipelineFunnel>(`/ats/jobs/${jobId}/funnel`),
    rescore: (jobId: number): Promise<{ jobId: number; rescored: number }> =>
      post<{ jobId: number; rescored: number }>(`/ats/jobs/${jobId}/rescore`, {}),

    // Per-application views
    getApplication: (id: number): Promise<Application> =>
      get<Application>(`/ats/applications/${id}`),
    timeline: (id: number): Promise<ApplicationEvent[]> =>
      get<ApplicationEvent[]>(`/ats/applications/${id}/timeline`),
    match: (id: number): Promise<MatchBreakdown> =>
      get<MatchBreakdown>(`/ats/applications/${id}/match`),
    forCandidate: (email: string): Promise<Application[]> =>
      get<Application[]>(`/ats/candidates/${encodeURIComponent(email)}/applications`),

    // Actions
    moveStage: (
      id: number,
      stage: ApplicationStage,
      actor: string,
      note?: string
    ): Promise<Application> =>
      post<Application>(`/ats/applications/${id}/stage`, { stage, actor, note }),
    advance: (id: number, actor: string, note?: string): Promise<Application> =>
      post<Application>(`/ats/applications/${id}/advance`, { actor, note }),
    reject: (id: number, actor: string, reason?: string): Promise<Application> =>
      post<Application>(`/ats/applications/${id}/reject`, { actor, reason }),
    withdraw: (id: number, actor: string, reason?: string): Promise<Application> =>
      post<Application>(`/ats/applications/${id}/withdraw`, { actor, reason }),
    rate: (id: number, rating: number, actor: string): Promise<Application> =>
      post<Application>(`/ats/applications/${id}/rating`, { rating, actor }),
    assign: (id: number, assignee: string, actor: string): Promise<Application> =>
      post<Application>(`/ats/applications/${id}/assign`, { assignee, actor }),

    // Notes
    notes: (id: number): Promise<ApplicationNote[]> =>
      get<ApplicationNote[]>(`/ats/applications/${id}/notes`),
    addNote: (id: number, author: string, body: string): Promise<ApplicationNote> =>
      post<ApplicationNote>(`/ats/applications/${id}/notes`, { author, body }),
  },
  research: {
    overview: () => get<Record<string, unknown>>("/research/overview"),
    jobs: () => get<Record<string, unknown>[]>("/research/jobs"),
    salaries: () => get<Record<string, unknown>>("/research/salaries"),
  },
};
