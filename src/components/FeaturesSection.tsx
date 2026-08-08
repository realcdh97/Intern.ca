import { Briefcase, GraduationCap, MapPin, Shield } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Region-Specific Jobs",
    description: "Find internships and grad roles tailored to your country and region — not buried under US-only listings.",
  },
  {
    icon: GraduationCap,
    title: "University Partnerships",
    description: "We partner with universities across 85+ countries to bring verified opportunities directly to students.",
  },
  {
    icon: Briefcase,
    title: "Direct Applications",
    description: "Apply directly to international employers and track your application status in real-time.",
  },
  {
    icon: Shield,
    title: "Verified Employers",
    description: "Every company on our platform is vetted so you can apply with confidence — no scams, no ghost postings.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why students choose <span className="text-gradient">Intern.ca</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Purpose-built for the international job market — none of the noise, all of the signal.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-lg gradient-primary">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
