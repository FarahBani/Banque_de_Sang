package com.banquesang.controller;

import com.banquesang.model.entity.AgentBanque;
import com.banquesang.service.IAgentBanqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
public class AgentController {

    private final IAgentBanqueService agentService;

    @GetMapping
    public ResponseEntity<List<AgentBanque>> findAll() {
        return ResponseEntity.ok(agentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgentBanque> findById(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.findById(id));
    }

    @GetMapping("/centre/{centreId}")
    public ResponseEntity<List<AgentBanque>> findByCentre(@PathVariable Long centreId) {
        return ResponseEntity.ok(agentService.findByCentre(centreId));
    }

    @PostMapping
    public ResponseEntity<AgentBanque> creer(@RequestBody AgentBanque agent) {
        return ResponseEntity.ok(agentService.creer(agent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgentBanque> modifier(@PathVariable Long id,
                                                @RequestBody AgentBanque agent) {
        return ResponseEntity.ok(agentService.modifier(id, agent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        agentService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
