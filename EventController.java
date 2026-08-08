package com.example.demo.controller;

import com.example.demo.model.Event;
import com.example.demo.model.EventRegistration;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.EventRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private EventRegistrationRepository registrationRepository;

    @GetMapping
    public List<Event> getAll() {
        return eventRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getById(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Event create(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    @PostMapping("/{id}/register")
    public EventRegistration register(@PathVariable Long id, @RequestBody EventRegistration registration) {
        registration.setEventId(id);
        registration.setRegisteredAt(LocalDateTime.now());
        return registrationRepository.save(registration);
    }

    @GetMapping("/{id}/registrations/count")
    public Map<String, Long> registrationCount(@PathVariable Long id) {
        return Map.of("count", registrationRepository.countByEventId(id));
    }
}
