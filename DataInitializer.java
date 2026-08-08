package com.example.demo.config;

import com.example.demo.model.Company;
import com.example.demo.model.Event;
import com.example.demo.model.Job;
import com.example.demo.repository.CompanyRepository;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(JobRepository jobs, CompanyRepository companies, EventRepository events) {
        return args -> {
            if (jobs.count() == 0) {
                jobs.saveAll(List.of(
                    new Job(null, "Software Engineer Intern", "TechGlobal", "London, UK", "Internship", true, true, "Join our core platform team to build scalable microservices. We sponsor Tier 2 visas.", "£35,000 - £45,000 / yr"),
                    new Job(null, "Data Analyst Graduate", "DataFin", "Toronto, Canada", "New Grad", false, true, "Analyze financial datasets. Open to international students with post-graduate work permits or requiring LMIA.", "$70,000 - $85,000 CAD"),
                    new Job(null, "Product Marketing Intern", "GrowthX", "Berlin, Germany", "Internship", true, false, "Remote friendly across Europe. Help us launch our new B2B SaaS product.", "€2,500 / mo"),
                    new Job(null, "Frontend Engineer Intern", "Pixelware", "San Francisco, USA", "Internship", false, true, "Build delightful React interfaces with our design team. H-1B sponsorship available for standout interns.", "$8,000 / mo"),
                    new Job(null, "Data Engineer Graduate", "NeuralCo", "Toronto, Canada", "New Grad", true, true, "Work on production data pipelines and analytics systems. We support work permits and PR pathways.", "$95,000 - $115,000 CAD"),
                    new Job(null, "UX Research Intern", "GrowthX", "Berlin, Germany", "Internship", true, false, "Run usability studies across our European markets.", "€2,800 / mo"),
                    new Job(null, "Backend Engineer Graduate", "TechGlobal", "London, UK", "New Grad", false, true, "Own services powering millions of requests. Visa sponsorship provided.", "£50,000 - £62,000 / yr"),
                    new Job(null, "Finance Analyst Intern", "DataFin", "New York, USA", "Internship", false, false, "Support our quantitative trading desk with market analysis.", "$45 - $55 / hr"),
                    new Job(null, "Cloud Engineer Graduate", "Pixelware", "Sydney, Australia", "New Grad", true, true, "Help scale our infrastructure on AWS. Sponsorship for skilled migration available.", "$85,000 - $100,000 AUD"),
                    new Job(null, "Mobile Developer Intern", "NeuralCo", "London, UK", "Internship", true, false, "Ship features for our cross-platform mobile app used by students worldwide.", "£32,000 / yr")
                ));
            }

            if (companies.count() == 0) {
                companies.saveAll(List.of(
                    new Company(null, "TechGlobal", "Software", "London, UK", "1001-5000", "https://techglobal.example", null, true, "TechGlobal builds the infrastructure that powers modern internet companies. We hire ambitious interns and new grads from around the world and sponsor work visas."),
                    new Company(null, "DataFin", "Financial Services", "Toronto, Canada", "501-1000", "https://datafin.example", null, true, "DataFin applies data science to financial markets. We partner with universities to bring global talent onto our analytics teams."),
                    new Company(null, "GrowthX", "Marketing Tech", "Berlin, Germany", "51-200", "https://growthx.example", null, false, "GrowthX is a remote-first B2B SaaS company helping businesses grow across Europe."),
                    new Company(null, "Pixelware", "Design Software", "San Francisco, USA", "201-500", "https://pixelware.example", null, true, "Pixelware makes the creative tools designers love. We sponsor H-1B visas for exceptional engineers."),
                    new Company(null, "NeuralCo", "Software Infrastructure", "Toronto, Canada", "201-500", "https://neuralco.example", null, true, "NeuralCo ships production scale software infrastructure and supports international hires through PR pathways.")
                ));
            }

            if (events.count() == 0) {
                events.saveAll(List.of(
                    new Event(null, "Global Tech Career Fair 2026", "Intern.ca", "Career Fair", "2026-07-15", "10:00 - 16:00 EST", true, "Online", null, "Meet 50+ companies hiring interns and new grads who sponsor visas. Drop into booths, chat with recruiters and apply on the spot."),
                    new Event(null, "TechGlobal Info Session", "TechGlobal", "Info Session", "2026-06-20", "13:00 - 14:00 BST", true, "Online", null, "Learn about TechGlobal's internship program, visa sponsorship and what we look for in candidates."),
                    new Event(null, "Resume & Portfolio Workshop", "Intern.ca", "Workshop", "2026-06-25", "17:00 - 18:30 EST", true, "Online", null, "A hands-on session to make your resume and portfolio stand out to international employers."),
                    new Event(null, "DataFin Analytics Meetup", "DataFin", "Info Session", "2026-07-02", "18:00 - 19:30 EST", false, "Toronto, Canada", null, "In-person evening with the DataFin analytics team. Food and networking provided.")
                ));
            }
        };
    }
}
