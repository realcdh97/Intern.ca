import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Users, Search, ArrowRight } from "lucide-react";
import { Company } from "@/types";
import { api } from "@/services/api";

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.companies.getAll()
      .then(setCompanies)
      .catch((err) => console.error("Failed to fetch companies", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = companies.filter((c) =>
    `${c.name} ${c.industry} ${c.location}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="pt-24 pb-10 px-4 bg-background border-b">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Explore Companies</h1>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl">
            Discover employers hiring international students and graduates — and see who sponsors visas.
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, industry or location..."
              className="pl-10 h-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl py-10 px-4">
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading companies...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">No companies found.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map((company) => (
              <Link key={company.id} to={`/companies/${company.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4 pb-3">
                    <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0 overflow-hidden">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-7 w-7" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{company.industry}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {company.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {company.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      {company.sponsorsVisas ? (
                        <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">Sponsors visas</Badge>
                      ) : <span />}
                      <span className="flex items-center gap-1 text-sm text-primary font-medium">
                        View <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Companies;
