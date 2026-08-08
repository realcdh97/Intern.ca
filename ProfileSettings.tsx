import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { ArrowLeft, Save, User, Building2, GraduationCap, School, Briefcase } from "lucide-react";

const ProfileSettings = () => {
  const { user, role, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    avatar_url: "",
    // Student
    university: "",
    major: "",
    graduation_year: "",
    resume_url: "",
    // Company
    company_name: "",
    company_website: "",
    company_size: "",
    industry: "",
    // Partner School
    school_name: "",
    school_country: "",
    school_contact_email: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
        university: profile.university || "",
        major: profile.major || "",
        graduation_year: profile.graduation_year?.toString() || "",
        resume_url: profile.resume_url || "",
        company_name: profile.company_name || "",
        company_website: profile.company_website || "",
        company_size: profile.company_size || "",
        industry: profile.industry || "",
        school_name: profile.school_name || "",
        school_country: profile.school_country || "",
        school_contact_email: profile.school_contact_email || "",
      });
    }
  }, [profile]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    const payload: Record<string, string | number | null> = {
      full_name: form.full_name || null,
      bio: form.bio || null,
      avatar_url: form.avatar_url || null,
    };

    if (role === "student") {
      payload.university = form.university || null;
      payload.major = form.major || null;
      payload.graduation_year = form.graduation_year ? parseInt(form.graduation_year) : null;
      payload.resume_url = form.resume_url || null;
    }
    if (role === "company") {
      payload.company_name = form.company_name || null;
      payload.company_website = form.company_website || null;
      payload.company_size = form.company_size || null;
      payload.industry = form.industry || null;
    }
    if (role === "partner_school") {
      payload.school_name = form.school_name || null;
      payload.school_country = form.school_country || null;
      payload.school_contact_email = form.school_contact_email || null;
    }
    if (role === "admin") {
      // Admins can edit all fields
      Object.assign(payload, {
        university: form.university || null,
        major: form.major || null,
        graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
        resume_url: form.resume_url || null,
        company_name: form.company_name || null,
        company_website: form.company_website || null,
        company_size: form.company_size || null,
        industry: form.industry || null,
        school_name: form.school_name || null,
        school_country: form.school_country || null,
        school_contact_email: form.school_contact_email || null,
      });
    }

    const { error } = await supabase
      .from("profiles")
      .update(payload as any)
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
    setLoading(false);
  };

  const roleConfig: Record<string, { icon: React.ElementType; label: string }> = {
    admin: { icon: User, label: "Admin" },
    student: { icon: GraduationCap, label: "Student" },
    company: { icon: Building2, label: "Company" },
    partner_school: { icon: School, label: "Partner School" },
  };

  const current = roleConfig[role || "student"];
  const RoleIcon = current.icon;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Intern.ca" className="h-8 w-auto" />
            <span className="text-sm font-medium text-muted-foreground">Profile Settings</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl gradient-cta flex items-center justify-center">
            <RoleIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">{current.label} account</p>
          </div>
        </div>

        {/* General Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">General Information</CardTitle>
            <CardDescription>Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Tell us about yourself..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Avatar URL</Label>
              <Input value={form.avatar_url} onChange={(e) => update("avatar_url", e.target.value)} placeholder="https://example.com/photo.jpg" />
            </div>
          </CardContent>
        </Card>

        {/* Student Fields */}
        {(role === "student" || role === "admin") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /> Student Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>University</Label>
                  <Input value={form.university} onChange={(e) => update("university", e.target.value)} placeholder="e.g. University of Tokyo" />
                </div>
                <div className="space-y-2">
                  <Label>Major</Label>
                  <Input value={form.major} onChange={(e) => update("major", e.target.value)} placeholder="e.g. Computer Science" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Graduation Year</Label>
                  <Input type="number" value={form.graduation_year} onChange={(e) => update("graduation_year", e.target.value)} placeholder="2026" />
                </div>
                <div className="space-y-2">
                  <Label>Resume URL</Label>
                  <Input value={form.resume_url} onChange={(e) => update("resume_url", e.target.value)} placeholder="Link to your resume" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company Fields */}
        {(role === "company" || role === "admin") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={form.company_name} onChange={(e) => update("company_name", e.target.value)} placeholder="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={form.company_website} onChange={(e) => update("company_website", e.target.value)} placeholder="https://acme.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Input value={form.company_size} onChange={(e) => update("company_size", e.target.value)} placeholder="e.g. 50-200" />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input value={form.industry} onChange={(e) => update("industry", e.target.value)} placeholder="e.g. Technology" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Partner School Fields */}
        {(role === "partner_school" || role === "admin") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <School className="h-5 w-5 text-primary" /> School Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>School Name</Label>
                <Input value={form.school_name} onChange={(e) => update("school_name", e.target.value)} placeholder="e.g. Berlin International School" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={form.school_country} onChange={(e) => update("school_country", e.target.value)} placeholder="e.g. Germany" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input type="email" value={form.school_contact_email} onChange={(e) => update("school_contact_email", e.target.value)} placeholder="admin@school.edu" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading} className="gradient-cta border-0">
            <Save className="h-4 w-4 mr-1" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
