import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Globe, Briefcase, Search, ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import { Job } from "@/types";
import { api } from "@/services/api";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSaved, toggle } = useSavedJobs();
  
  const [filterInternship, setFilterInternship] = useState(false);
  const [filterNewGrad, setFilterNewGrad] = useState(false);
  const [filterRemote, setFilterRemote] = useState(false);
  const [filterSponsorship, setFilterSponsorship] = useState(false);
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    const type = (filterInternship && !filterNewGrad) ? "Internship" : (filterNewGrad && !filterInternship) ? "New Grad" : undefined;
    
    api.jobs.getAll({ remote: filterRemote, sponsorship: filterSponsorship, type })
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch jobs", err);
        setLoading(false);
      });
  }, [filterRemote, filterSponsorship, filterInternship, filterNewGrad]);

  const visibleJobs = jobs.filter((job) => {
    const matchesSearch = `${job.title} ${job.company} ${job.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSaved = !filterSavedOnly || isSaved(job.id);
    return matchesSearch && matchesSaved;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 pb-12 px-4 bg-background border-b">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Find Your Global Opportunity</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
            Discover internships and entry-level roles that sponsor visas or offer remote work globally.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Job title, company, or keywords..." 
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="h-12 px-8 gradient-cta border-0">Search Jobs</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-5xl py-12 px-4 flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Job Type</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-input" checked={filterInternship} onChange={e => setFilterInternship(e.target.checked)} /> Internship
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-input" checked={filterNewGrad} onChange={e => setFilterNewGrad(e.target.checked)} /> New Grad
              </label>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Location & Visa</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-input" checked={filterRemote} onChange={e => setFilterRemote(e.target.checked)} /> Remote Available
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-input" checked={filterSponsorship} onChange={e => setFilterSponsorship(e.target.checked)} /> Visa Sponsorship
              </label>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Saved</h3>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-input" checked={filterSavedOnly} onChange={e => setFilterSavedOnly(e.target.checked)} /> Saved jobs only
            </label>
          </div>
        </div>

        {/* Job Feed */}
        <div className="flex-1 space-y-4">
          {loading ? (
             <div className="text-center py-10 text-muted-foreground">Loading jobs...</div>
          ) : visibleJobs.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">No jobs found.</div>
          ) : (
            visibleJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/jobs/${job.id}`}>
                      <CardTitle className="text-xl mb-1 hover:text-primary transition-colors">{job.title}</CardTitle>
                    </Link>
                    <p className="text-muted-foreground font-medium">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex gap-2">
                      {job.sponsorship && <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">Sponsorship</Badge>}
                      {job.remote && <Badge variant="outline">Remote</Badge>}
                    </div>
                    <button
                      onClick={() => toggle(job.id)}
                      aria-label={isSaved(job.id) ? "Unsave job" : "Save job"}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isSaved(job.id) ? <BookmarkCheck className="w-5 h-5 text-primary" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4"/> {job.type}</span>
                  <span className="flex items-center gap-1"><Globe className="w-4 h-4"/> {job.salary}</span>
                </div>
                <p className="text-sm">{job.description}</p>
              </CardContent>
              <CardFooter className="pt-0 gap-2">
                <Button asChild variant="outline" className="mt-2">
                  <Link to={`/jobs/${job.id}`}>View details</Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="mt-2">
                      Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
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
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Jobs;
