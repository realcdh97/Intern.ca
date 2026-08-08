import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpg";
import type { Database } from "@/integrations/supabase/types";
import { GraduationCap, Building2, School } from "lucide-react";

type AppRole = Database["public"]["Enums"]["app_role"];
type SelectableRole = Exclude<AppRole, "admin" | "recruiter">;

const SelectRole = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<SelectableRole | null>(null);
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: "student" as SelectableRole, label: t("roleStudent"), description: t("roleStudentDesc"), icon: <GraduationCap className="h-6 w-6" /> },
    { value: "company" as SelectableRole, label: t("roleCompany"), description: t("roleCompanyDesc"), icon: <Building2 className="h-6 w-6" /> },
    { value: "partner_school" as SelectableRole, label: t("roleSchool"), description: t("roleSchoolDesc"), icon: <School className="h-6 w-6" /> },
  ];

  const handleSubmit = async () => {
    if (!selected || !user) return;
    setLoading(true);

    const { error } = await supabase.from("user_roles").insert({
      user_id: user.id,
      role: selected,
    });

    if (error) {
      toast({ title: t("roleSettingUp"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome to Intern.ca!" });
      // Force a page reload so AuthContext re-fetches role
      window.location.href = "/dashboard";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <img src={logo} alt="Intern.ca" className="h-10 w-auto mx-auto mb-2" />
          <CardTitle className="text-2xl">{t("roleTitle")}</CardTitle>
          <CardDescription>{t("roleSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => setSelected(r.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-colors ${
                selected === r.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className={`p-2 rounded-md ${selected === r.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {r.icon}
              </div>
              <div>
                <p className="font-medium text-foreground">{r.label}</p>
                <p className="text-sm text-muted-foreground">{r.description}</p>
              </div>
            </button>
          ))}
          <Button
            className="w-full gradient-cta border-0 mt-4"
            disabled={!selected || loading}
            onClick={handleSubmit}
          >
            {loading ? t("roleSettingUp") : t("roleContinue")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectRole;
