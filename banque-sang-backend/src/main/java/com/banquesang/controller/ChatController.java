package com.banquesang.controller;

import com.banquesang.model.dto.ChatRequest;
import com.banquesang.model.dto.ChatResponse;
import com.banquesang.service.OllamaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ChatController {

    @Autowired
    private OllamaService ollamaService;

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {

        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return new ChatResponse("Veuillez poser une question.", false);
        }

        String response = ollamaService.chat(
                request.getMessage(),
                request.getContexte()
        );

        return new ChatResponse(response, true);
    }

    @GetMapping("/health")
    public String health() {
        return "Chat service OK";
    }
}