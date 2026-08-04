import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Globe, Briefcase, Bookmark, BookmarkCheck, Building2 } from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import { Job } from "@/types";
import { api } from "@/services/api";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { isSaved, toggle } = useSavedJobs();

  useEffect(() => {
    if (!id) return;
    api.jobs.getAll()
      .then((jobs) => setJob(jobs.find((j) => j.id === Number(id)) ?? null))
      .catch((err) => console.error("Failed to load job", err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      {loading ? (
        <div className="pt-32 text-center text-muted-foreground">Loading...</div>
      ) : !job ? (
        <div className="pt-32 text-center text-muted-foreground">Job not found.</div>
      ) : (
        <div className="container mx-auto max-w-4xl pt-24 pb-12 px-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl mb-1">{job.title}</CardTitle>
                  <p className="text-muted-foreground font-medium">{job.company}</p>
                </div>
                <div className="flex gap-2">
                  {job.sponsorship && <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">Sponsorship</Badge>}
                  {job.remote && <Badge variant="outline">Remote</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.type}</span>
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {job.salary}</span>
              </div>

              <div>
                <h3 className="font-semibold mb-2">About this role</h3>
                <p className="text-sm leading-relaxed text-foreground/90">{job.description}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gradient-cta border-0 px-8">Apply Now</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                      <DialogDescription>
                        Submit your application to {job.company}. We will send a copy to your email.
                      </DialogDescription>
                    </DialogHeader>
                    <ApplicationForm jobId={job.id} />
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={() => toggle(job.id)}>
                  {isSaved(job.id) ? (
                    <><BookmarkCheck className="w-4 h-4 mr-2" /> Saved</>
                  ) : (
                    <><Bookmark className="w-4 h-4 mr-2" /> Save job</>
                  )}
                </Button>

                <Button variant="ghost" asChild>
                  <Link to="/companies"><Building2 className="w-4 h-4 mr-2" /> View company</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button asChild variant="link" className="mt-4 px-0">
            <Link to="/jobs">← Back to all jobs</Link>
          </Button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default JobDetail;
