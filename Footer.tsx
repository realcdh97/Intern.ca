import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-4"><Logo withLink={false} className="h-8 w-auto" /></div>
            <p className="text-sm text-muted-foreground">
              The global job board for students and graduates outside the US.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">For Students</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Career Resources</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Resume Builder</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3" id="employers">For Employers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Post a Job</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Employer Branding</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 Intern.ca. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
