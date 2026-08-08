import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/services/api";

interface ApplicationFormProps {
  jobId: number;
  onSuccess?: () => void;
}

export const ApplicationForm = ({ jobId, onSuccess }: ApplicationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    portfolioUrl: "",
    coverLetter: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.applications.submit({ ...formData, jobId });
      toast.success("Application submitted successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" required value={formData.candidateName} onChange={e => setFormData({...formData, candidateName: e.target.value})} placeholder="Jane Doe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" required value={formData.candidateEmail} onChange={e => setFormData({...formData, candidateEmail: e.target.value})} placeholder="jane@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio / LinkedIn URL</Label>
        <Input id="portfolio" value={formData.portfolioUrl} onChange={e => setFormData({...formData, portfolioUrl: e.target.value})} placeholder="https://linkedin.com/in/janedoe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover Letter / Note</Label>
        <textarea id="coverLetter" required className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.coverLetter} onChange={e => setFormData({...formData, coverLetter: e.target.value})} placeholder="Why are you a good fit for this role?"></textarea>
      </div>
      <Button type="submit" className="w-full gradient-cta border-0" disabled={loading}>
        {loading ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
};
