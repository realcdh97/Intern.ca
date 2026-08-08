package com.example.demo.controller;

import com.example.demo.model.Message;
import com.example.demo.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageRepository repository;

    @GetMapping("/thread/{threadId}")
    public List<Message> getThread(@PathVariable String threadId) {
        return repository.findByThreadIdOrderBySentAtAsc(threadId);
    }

    @GetMapping("/inbox/{userId}")
    public List<Message> getInbox(@PathVariable String userId) {
        return repository.findBySenderIdOrRecipientIdOrderBySentAtDesc(userId, userId);
    }

    @PostMapping
    public Message send(@RequestBody Message message) {
        if (message.getThreadId() == null || message.getThreadId().isBlank()) {
            message.setThreadId(threadId(message.getSenderId(), message.getRecipientId()));
        }
        message.setSentAt(LocalDateTime.now());
        message.setRead(false);
        return repository.save(message);
    }

    private String threadId(String a, String b) {
        return a.compareTo(b) <= 0 ? a + "__" + b : b + "__" + a;
    }
}
