import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const { user, role, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <Link to="/jobs" className="hover:text-foreground transition-colors">{t("navJobs")}</Link>
          <Link to="/companies" className="hover:text-foreground transition-colors">{t("navCompanies")}</Link>
          <Link to="/events" className="hover:text-foreground transition-colors">{t("navEvents")}</Link>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/messages")}>
                {t("navMessages")}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                {t("navDashboard")}
              </Button>
              <Button size="sm" variant="outline" onClick={() => { signOut(); navigate("/"); }}>
                {t("navSignOut")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                {t("navLogIn")}
              </Button>
              <Button size="sm" className="gradient-cta border-0" onClick={() => navigate("/signup")}>
                {t("navSignUpFree")}
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
