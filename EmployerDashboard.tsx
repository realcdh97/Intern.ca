import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Job, Application } from "@/types";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    api.jobs.getAll()
      .then(data => {
        setJobs(data);
        setLoadingJobs(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingJobs(false);
      });
  }, []);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setLoadingApps(true);
    api.applications.getByJob(job.id)
      .then(data => {
        setApplications(data);
        setLoadingApps(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingApps(false);
      });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-12 px-4 container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Employer Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Jobs List */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold">Your Job Postings</h2>
            {loadingJobs ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : jobs.length === 0 ? (
              <p className="text-muted-foreground">No jobs posted yet.</p>
            ) : (
              jobs.map(job => (
                <Card 
                  key={job.id} 
                  className={`cursor-pointer transition-colors ${selectedJob?.id === job.id ? 'border-primary' : 'hover:border-primary/50'}`}
                  onClick={() => handleSelectJob(job)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{job.type} • {job.location}</p>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>

          {/* Applications View */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Applications</h2>
            {!selectedJob ? (
              <Card className="flex items-center justify-center h-[300px] text-muted-foreground shadow-sm">
                Select a job to view its applications
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">Showing applications for: {selectedJob.title}</h3>
                  <Badge variant="secondary">{applications.length} Candidates</Badge>
                </div>

                {loadingApps ? (
                  <p className="text-muted-foreground">Loading applications...</p>
                ) : applications.length === 0 ? (
                  <Card className="flex items-center justify-center h-[200px] text-muted-foreground shadow-sm">
                    No applications received yet.
                  </Card>
                ) : (
                  applications.map(app => (
                    <Card key={app.id} className="shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{app.candidateName}</CardTitle>
                            <a href={`mailto:${app.candidateEmail}`} className="text-sm text-primary hover:underline">{app.candidateEmail}</a>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{app.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {app.portfolioUrl && (
                          <div className="mb-4">
                            <span className="text-sm font-medium">Portfolio: </span>
                            <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{app.portfolioUrl}</a>
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium">Cover Letter:</span>
                          <p className="text-sm mt-1 text-muted-foreground bg-muted p-3 rounded-md whitespace-pre-wrap">{app.coverLetter}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployerDashboard;
