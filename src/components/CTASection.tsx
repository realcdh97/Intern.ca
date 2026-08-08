import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="gradient-cta rounded-2xl p-12 md:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to launch your global career?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            Join 200,000+ students already using Intern.ca to find their dream internship abroad.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-card text-foreground hover:bg-card/90 font-semibold px-8">
              Sign Up as Student
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8">
              Post a Job
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
