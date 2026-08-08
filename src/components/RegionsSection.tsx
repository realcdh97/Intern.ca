const regions = [
  { name: "Europe", jobs: "4,200+", emoji: "🇪🇺" },
  { name: "Southeast Asia", jobs: "2,800+", emoji: "🌏" },
  { name: "Latin America", jobs: "1,900+", emoji: "🌎" },
  { name: "Africa", jobs: "1,500+", emoji: "🌍" },
  { name: "Middle East", jobs: "980+", emoji: "🕌" },
  { name: "South Asia", jobs: "1,600+", emoji: "🏔️" },
];

const RegionsSection = () => {
  return (
    <section id="regions" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Opportunities across every continent
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you're in Lagos, Berlin, São Paulo, or Bangkok — we've got roles near you.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
            >
              <span className="text-4xl">{r.emoji}</span>
              <div>
                <h3 className="font-semibold text-foreground">{r.name}</h3>
                <p className="text-sm text-muted-foreground">{r.jobs} open roles</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegionsSection;
