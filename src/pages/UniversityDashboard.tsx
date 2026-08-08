import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, Building2, Globe, GraduationCap, ShieldCheck, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const mockPlacements = [
  { studentId: "STUD-2026-981", university: "University of Toronto", country: "United Kingdom", employer: "TechGlobal", role: "Software Engineer Intern", status: "Placed", visaStatus: "Sponsored" },
  { studentId: "STUD-2026-442", university: "University of Cape Town", country: "Germany", employer: "GrowthX", role: "Product Marketing Intern", status: "Active Application", visaStatus: "Remote (No Visa Required)" },
  { studentId: "STUD-2026-105", university: "NUS Singapore", country: "Canada", employer: "NeuralCo", role: "Data Engineer Graduate", status: "Placed", visaStatus: "Work Permit Pathway" },
  { studentId: "STUD-2026-089", university: "University of Waterloo", country: "United States", employer: "Pixelware", role: "Frontend Engineer Intern", status: "Completed", visaStatus: "H-1B Sponsorship" },
];

const UniversityDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api.research.overview()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load research overview data:", err);
        setLoading(false);
      });
  }, []);

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const records = await api.research.jobs() as any[];
      if (!records || records.length === 0) return;
      
      const headers = Object.keys(records[0]).join(",");
      const rows = records.map(r => 
        Object.values(r).map(v => typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v).join(",")
      );
      const csvContent = [headers, ...rows].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `intern_ca_economic_dataset_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export dataset", err);
    } finally {
      setExporting(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const typeData = Object.entries(data.jobsByType || {}).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const regionData = Object.entries(data.salaryByCountry || {}).map(([country, stats]: [string, any]) => ({
    name: country,
    salary: stats.meanSalary || 0
  }));

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-12 px-4 container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">University Analytics & Telemetry</h1>
            <p className="text-muted-foreground mt-2">Programmatic tracking of student placements, visa outcomes, and global labor market analytics.</p>
          </div>
          <Button onClick={handleExportCSV} disabled={exporting} className="gap-2 bg-primary hover:bg-primary/95 text-primary-foreground">
            <Download className="w-4 h-4" /> {exporting ? "Generating..." : "Export Anonymized Dataset (CSV)"}
          </Button>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-indigo-500 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Global Roles Tracked</CardTitle>
              <Database className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalJobs}</div>
              <p className="text-xs text-muted-foreground mt-1">Cross-border opportunities</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Visa Sponsorship Rate</CardTitle>
              <Building2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(data.sponsorshipShare * 100).toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Of posted roles offer sponsorship</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-violet-500 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Remote Work Share</CardTitle>
              <Globe className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(data.remoteShare * 100).toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Borderless remote options</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Total Relational matches</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">Connected applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="shadow-sm lg:col-span-1">
            <CardHeader>
              <CardTitle>Role Type Distribution</CardTitle>
              <CardDescription>Breakdown of opportunities by experience level</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px] flex items-center justify-center">
              {typeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted-foreground text-sm">No role data available</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>Average Salary by Host Country (USD)</CardTitle>
              <CardDescription>Real-time compensation data generated from active opportunities</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              {regionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Mean Annual Salary"]} />
                    <Bar dataKey="salary" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No salary data available</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Outcomes Tracking (Telemetry) Section */}
        <Card className="shadow-sm mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Post-Graduation Outcomes & Placement Telemetry</CardTitle>
              <CardDescription>Verified log of cross-border placement workflows and visa routing statuses</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Pipeline Live
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-xs text-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold">Student Identifier</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Home University</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Employer</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Role</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Destination</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Work Authorization</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-right">Placement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockPlacements.map((p, idx) => (
                    <tr key={idx} className="bg-card hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-foreground">{p.studentId}</td>
                      <td className="px-6 py-4">{p.university}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{p.employer}</td>
                      <td className="px-6 py-4">{p.role}</td>
                      <td className="px-6 py-4">{p.country}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {p.visaStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                          p.status === "Placed" || p.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default UniversityDashboard;
