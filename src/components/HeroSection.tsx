import heroImage from "@/assets/hero-students.jpg";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Search } from "lucide-react";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="gradient-hero pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Globe className="h-4 w-4" />
              {t("heroBuiltFor")}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-foreground">
              {t("heroTitleStart")}{" "}
              <span className="text-gradient">{t("heroTitleEnd")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              {t("heroDescription")}
            </p>
            <div className="flex items-center gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("heroSearchPlaceholder")}
                  className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <Button className="gradient-cta border-0 px-6 py-3 h-auto">{t("heroSearchBtn")}</Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span><strong className="text-foreground">12,000+</strong> {t("heroStatsJobs")}</span>
              <span><strong className="text-foreground">3,500+</strong> {t("heroStatsCompanies")}</span>
              <span><strong className="text-foreground">85+</strong> {t("heroStatsCountries")}</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src={heroImage}
              alt="Diverse international students ready to start their careers"
              className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              width={1280}
              height={720}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
