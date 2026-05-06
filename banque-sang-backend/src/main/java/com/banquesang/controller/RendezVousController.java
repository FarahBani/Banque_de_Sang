package com.banquesang.controller;

import com.banquesang.model.entity.RendezVous;
import com.banquesang.service.IRendezVousService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rendez-vous")
@RequiredArgsConstructor
public class RendezVousController {

    private final IRendezVousService rendezVousService;

    @GetMapping
    public ResponseEntity<List<RendezVous>> findAll() {
        return ResponseEntity.ok(rendezVousService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RendezVous> findById(@PathVariable Long id) {
        return ResponseEntity.ok(rendezVousService.findById(id));
    }

    @PostMapping
    public ResponseEntity<RendezVous> creer(@RequestBody RendezVous rendezVous) {
        return ResponseEntity.ok(rendezVousService.creer(rendezVous));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RendezVous> modifier(@PathVariable Long id,
                                               @RequestBody RendezVous rendezVous) {
        return ResponseEntity.ok(rendezVousService.modifier(id, rendezVous));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        rendezVousService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/confirmer")
    public ResponseEntity<Void> confirmer(@PathVariable Long id) {
        rendezVousService.confirmer(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/annuler")
    public ResponseEntity<Void> annuler(@PathVariable Long id) {
        rendezVousService.annuler(id);
        return ResponseEntity.ok().build();
    }
}