package com.banquesang.controller;

import com.banquesang.model.dto.DemandeSangDTO;
import com.banquesang.model.entity.DemandeSang;
import com.banquesang.service.IDemandeSangService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/demandes")
@RequiredArgsConstructor
public class DemandeController {

    private final IDemandeSangService demandeSangService;

    @GetMapping
    public ResponseEntity<List<DemandeSang>> findAll() {
        return ResponseEntity.ok(demandeSangService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DemandeSang> findById(@PathVariable Long id) {
        return ResponseEntity.ok(demandeSangService.findById(id));
    }

    @GetMapping("/hopital/{hopitalId}")
    public ResponseEntity<List<DemandeSangDTO>> getByHopital(@PathVariable Long hopitalId) {
        return ResponseEntity.ok(demandeSangService.getDemandesByHopital(hopitalId));
    }

    @PostMapping
    public ResponseEntity<DemandeSang> creer(@RequestBody DemandeSang demandeSang) {
        return ResponseEntity.ok(demandeSangService.creer(demandeSang));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DemandeSang> modifier(@PathVariable Long id,
                                                @RequestBody DemandeSang demandeSang) {
        return ResponseEntity.ok(demandeSangService.modifier(id, demandeSang));
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<DemandeSangDTO> updateStatut(@PathVariable Long id,
                                                       @RequestParam String statut) {
        return ResponseEntity.ok(demandeSangService.updateStatut(id, statut));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        demandeSangService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}