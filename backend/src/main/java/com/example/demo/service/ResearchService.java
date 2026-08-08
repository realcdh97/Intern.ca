package com.example.demo.service;

import com.example.demo.model.Job;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Read-only, anonymized job-market data for economics research.
 * Exposes aggregated salary, location and category statistics. No candidate
 * PII (names, emails, cover letters) is ever returned.
 */
@Service
public class ResearchService {

    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private ApplicationRepository applicationRepository;

    private static final Pattern NUMBER = Pattern.compile("([0-9][0-9,\\.]*)");

    /** A single anonymized job-market record with a normalized annual salary. */
    public Map<String, Object> toRecord(Job job) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("id", job.getId());
        r.put("title", job.getTitle());
        r.put("company", job.getCompany());
        r.put("location", job.getLocation());
        r.put("country", country(job.getLocation()));
        r.put("type", job.getType());
        r.put("remote", job.isRemote());
        r.put("sponsorship", job.isSponsorship());
        r.put("currency", currency(job.getSalary()));
        double[] range = annualSalaryRange(job.getSalary());
        r.put("salaryMin", range[0] > 0 ? range[0] : null);
        r.put("salaryMax", range[1] > 0 ? range[1] : null);
        r.put("salaryMidpoint", range[0] > 0 ? (range[0] + range[1]) / 2 : null);
        r.put("salaryRaw", job.getSalary());
        return r;
    }

    public List<Map<String, Object>> allRecords() {
        return jobRepository.findAll().stream().map(this::toRecord).collect(Collectors.toList());
    }

    public Map<String, Object> overview() {
        List<Job> jobs = jobRepository.findAll();
        long total = jobs.size();
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("totalJobs", total);
        out.put("totalApplications", applicationRepository.count());
        out.put("remoteShare", ratio(jobs.stream().filter(Job::isRemote).count(), total));
        out.put("sponsorshipShare", ratio(jobs.stream().filter(Job::isSponsorship).count(), total));
        out.put("jobsByType", countBy(jobs, Job::getType));
        out.put("jobsByCountry", countBy(jobs, j -> country(j.getLocation())));
        out.put("jobsByCurrency", countBy(jobs, j -> currency(j.getSalary())));
        out.put("salaryByType", salaryStatsBy(jobs, Job::getType));
        out.put("salaryByCountry", salaryStatsBy(jobs, j -> country(j.getLocation())));
        return out;
    }

    private Map<String, Long> countBy(List<Job> jobs, java.util.function.Function<Job, String> key) {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Job j : jobs) {
            String k = key.apply(j);
            if (k == null || k.isBlank()) k = "Unknown";
            map.merge(k, 1L, Long::sum);
        }
        return map;
    }

    /** mean/min/max annualized salary midpoint grouped by the given key. */
    private Map<String, Object> salaryStatsBy(List<Job> jobs, java.util.function.Function<Job, String> key) {
        Map<String, List<Double>> grouped = new LinkedHashMap<>();
        for (Job j : jobs) {
            double[] range = annualSalaryRange(j.getSalary());
            if (range[0] <= 0) continue;
            String k = key.apply(j);
            if (k == null || k.isBlank()) k = "Unknown";
            grouped.computeIfAbsent(k, x -> new ArrayList<>()).add((range[0] + range[1]) / 2);
        }
        Map<String, Object> out = new LinkedHashMap<>();
        for (Map.Entry<String, List<Double>> e : grouped.entrySet()) {
            List<Double> vals = e.getValue();
            double mean = vals.stream().mapToDouble(Double::doubleValue).average().orElse(0);
            double min = vals.stream().mapToDouble(Double::doubleValue).min().orElse(0);
            double max = vals.stream().mapToDouble(Double::doubleValue).max().orElse(0);
            Map<String, Object> stat = new LinkedHashMap<>();
            stat.put("count", vals.size());
            stat.put("meanSalary", Math.round(mean));
            stat.put("minSalary", Math.round(min));
            stat.put("maxSalary", Math.round(max));
            out.put(e.getKey(), stat);
        }
        return out;
    }

    private double ratio(long part, long total) {
        return total == 0 ? 0 : Math.round((double) part / total * 1000) / 1000.0;
    }

    private String country(String location) {
        if (location == null || location.isBlank()) return "Unknown";
        String[] parts = location.split(",");
        return parts[parts.length - 1].trim();
    }

    private String currency(String salary) {
        if (salary == null) return "Unknown";
        if (salary.contains("£")) return "GBP";
        if (salary.contains("€")) return "EUR";
        if (salary.contains("CAD")) return "CAD";
        if (salary.contains("AUD")) return "AUD";
        if (salary.contains("$")) return "USD";
        return "Unknown";
    }

    /** Returns {min, max} annualized salary, 0 when unparseable. Monthly figures are *12. */
    private double[] annualSalaryRange(String salary) {
        if (salary == null) return new double[]{0, 0};
        boolean monthly = salary.toLowerCase().contains("/ mo") || salary.toLowerCase().contains("/mo")
                || salary.toLowerCase().contains("month");
        boolean hourly = salary.toLowerCase().contains("/ hr") || salary.toLowerCase().contains("/hr")
                || salary.toLowerCase().contains("hour");
        List<Double> nums = new ArrayList<>();
        Matcher m = NUMBER.matcher(salary);
        while (m.find()) {
            try {
                nums.add(Double.parseDouble(m.group(1).replace(",", "")));
            } catch (NumberFormatException ignored) {
            }
        }
        if (nums.isEmpty()) return new double[]{0, 0};
        double min = nums.get(0);
        double max = nums.size() > 1 ? nums.get(1) : nums.get(0);
        double factor = monthly ? 12 : hourly ? 40 * 52 : 1;
        return new double[]{min * factor, max * factor};
    }
}
