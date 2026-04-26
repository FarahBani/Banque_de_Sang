package com.banquesang.controller;

import com.banquesang.model.entity.Hopital;
import com.banquesang.service.IHopitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hopitaux")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // React
public class HopitalController {

    private final IHopitalService hopitalService;

    @PostMapping
    public ResponseEntity<Hopital> creer(@RequestBody Hopital hopital) {
        return ResponseEntity.ok(hopitalService.creer(hopital));
    }

    @GetMapping
    public ResponseEntity<List<Hopital>> findAll() {
        return ResponseEntity.ok(hopitalService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hopital> findById(@PathVariable Long id) {
        return ResponseEntity.ok(hopitalService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hopital> modifier(
            @PathVariable Long id,
            @RequestBody Hopital hopital) {
        return ResponseEntity.ok(hopitalService.modifier(id, hopital));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        hopitalService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/avec-convention")
    public ResponseEntity<List<Hopital>> findAvecConvention() {
        return ResponseEntity.ok(hopitalService.findAvecConvention());
    }

    @PatchMapping("/{id}/convention")
    public ResponseEntity<Hopital> changerConvention(
            @PathVariable Long id,
            @RequestParam boolean active) {
        return ResponseEntity.ok(hopitalService.changerConvention(id, active));
    }
}