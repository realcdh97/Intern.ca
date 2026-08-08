import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Users, Globe, Briefcase, ArrowRight } from "lucide-react";
import { Company, Job } from "@/types";
import { api } from "@/services/api";

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.companies.getById(Number(id)), api.jobs.getAll()])
      .then(([c, allJobs]) => {
        setCompany(c);
        setJobs(allJobs.filter((j) => j.company === c.name));
      })
      .catch((err) => console.error("Failed to load company", err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      {loading ? (
        <div className="pt-32 text-center text-muted-foreground">Loading...</div>
      ) : !company ? (
        <div className="pt-32 text-center text-muted-foreground">Company not found.</div>
      ) : (
        <>
          <div className="pt-24 pb-10 px-4 bg-background border-b">
            <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row gap-6 sm:items-center">
              <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center text-white shrink-0 overflow-hidden">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-10 w-10" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
                <p className="text-muted-foreground">{company.industry}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {company.location}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {company.size} employees</span>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                </div>
              </div>
              {company.sponsorsVisas && (
                <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary h-fit">Sponsors visas</Badge>
              )}
            </div>
          </div>

          <div className="container mx-auto max-w-4xl py-10 px-4 space-y-8">
            <Card>
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/90">{company.description}</p>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-xl font-semibold mb-4">Open roles at {company.name}</h2>
              {jobs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No open roles right now.</p>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <Link key={job.id} to={`/jobs/${job.id}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center justify-between py-4">
                          <div>
                            <p className="font-semibold">{job.title}</p>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.type}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Button asChild variant="outline"><Link to="/companies">← Back to all companies</Link></Button>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default CompanyDetail;
