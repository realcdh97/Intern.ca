import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Internship",
    remote: false,
    sponsorship: false,
    description: "",
    salary: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.jobs.create(formData);
      toast.success("Job posted successfully!");
      navigate("/jobs");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-24 pb-12 px-4 container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Post a Global Opportunity</h1>
        
        <form onSubmit={handleSubmit} className="bg-background p-8 rounded-lg border shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Software Engineer Intern" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="e.g. Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. London, UK" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (Optional)</Label>
              <Input id="salary" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="e.g. £35k / year" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Job Type</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="Internship">Internship</option>
              <option value="New Grad">New Grad</option>
              <option value="Full Time">Full Time</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <textarea id="description" required className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the role and requirements..."></textarea>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="remote" checked={formData.remote} onCheckedChange={(checked) => setFormData({...formData, remote: checked === true})} />
              <Label htmlFor="remote" className="font-normal cursor-pointer">Remote Work Allowed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sponsorship" checked={formData.sponsorship} onCheckedChange={(checked) => setFormData({...formData, sponsorship: checked === true})} />
              <Label htmlFor="sponsorship" className="font-normal cursor-pointer">Visa Sponsorship Available</Label>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 gradient-cta border-0" disabled={loading}>
            {loading ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PostJob;
