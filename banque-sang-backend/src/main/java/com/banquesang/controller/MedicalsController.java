package com.banquesang.controller;

import com.banquesang.model.entity.MedecinHopital;
import com.banquesang.service.IMedecinHopitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medecins")
@RequiredArgsConstructor
public class MedicalsController {

    private final IMedecinHopitalService medecinService;

    @GetMapping
    public ResponseEntity<List<MedecinHopital>> findAll() {
        return ResponseEntity.ok(medecinService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedecinHopital> findById(@PathVariable Long id) {
        return ResponseEntity.ok(medecinService.findById(id));
    }

    @GetMapping("/hopital/{hopitalId}")
    public ResponseEntity<List<MedecinHopital>> findByHopital(@PathVariable Long hopitalId) {
        return ResponseEntity.ok(medecinService.findByHopital(hopitalId));
    }

    @PostMapping
    public ResponseEntity<MedecinHopital> creer(@RequestBody MedecinHopital medecin) {
        return ResponseEntity.ok(medecinService.creer(medecin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedecinHopital> modifier(@PathVariable Long id,
                                                   @RequestBody MedecinHopital medecin) {
        return ResponseEntity.ok(medecinService.modifier(id, medecin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        medecinService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
