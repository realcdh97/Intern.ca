import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { LogOut, Users, Briefcase, GraduationCap, Building2, School } from "lucide-react";

const roleDashboards = {
  admin: {
    title: "Admin Dashboard",
    icon: Users,
    description: "Full platform management",
    cards: [
      { title: "Manage Users", desc: "View and manage all platform users", icon: Users },
      { title: "Manage Jobs", desc: "Review and moderate job listings", icon: Briefcase },
      { title: "Partner Schools", desc: "Manage school partnerships", icon: School },
      { title: "Platform Analytics", desc: "View usage and growth metrics", icon: Building2 },
    ],
  },
  student: {
    title: "Student Dashboard",
    icon: GraduationCap,
    description: "Find your dream internship abroad",
    cards: [
      { title: "Browse Internships", desc: "Explore opportunities worldwide", icon: Briefcase },
      { title: "My Applications", desc: "Track your application status", icon: GraduationCap },
      { title: "My Profile", desc: "Update your resume and skills", icon: Users },
    ],
  },
  company: {
    title: "Company Dashboard",
    icon: Building2,
    description: "Find international talent for your team",
    cards: [
      { title: "Post a Job", desc: "Create a new internship listing", icon: Briefcase },
      { title: "Applications", desc: "Review candidate applications", icon: Users },
      { title: "Company Profile", desc: "Update your company information", icon: Building2 },
    ],
  },
  partner_school: {
    title: "Partner School Dashboard",
    icon: School,
    description: "Connect your students with global opportunities",
    cards: [
      { title: "Student Directory", desc: "View and manage your students", icon: GraduationCap },
      { title: "Partnerships", desc: "View employer partnerships", icon: Building2 },
      { title: "School Profile", desc: "Update school information", icon: School },
    ],
  },
};

const Dashboard = () => {
  const { user, role, profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const dashboard = roleDashboards[role];
  const Icon = dashboard.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto" />
            <span className="text-sm font-medium text-muted-foreground capitalize">
              {role.replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile?.full_name || user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
              <Users className="h-4 w-4 mr-1" /> Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl gradient-cta flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{dashboard.title}</h1>
            <p className="text-muted-foreground">{dashboard.description}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboard.cards.map((card) => {
            const CardIcon = card.icon;
            return (
              <Card key={card.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CardIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription>{card.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
