package com.banquesang.controller;

import com.banquesang.model.entity.Don;
import com.banquesang.service.IDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dons")
@RequiredArgsConstructor
public class DonController {

    private final IDonService donService;

    @GetMapping
    public ResponseEntity<List<Don>> findAll() {
        return ResponseEntity.ok(donService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Don> findById(@PathVariable Long id) {
        return ResponseEntity.ok(donService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Don> creer(@RequestBody Don don) {
        return ResponseEntity.ok(donService.creer(don));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Don> modifier(@PathVariable Long id,
                                        @RequestBody Don don) {
        return ResponseEntity.ok(donService.modifier(id, don));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        donService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/valider")
    public ResponseEntity<Void> valider(@PathVariable Long id) {
        donService.valider(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/exclure")
    public ResponseEntity<Void> exclure(@PathVariable Long id,
                                        @RequestParam String motif) {
        donService.exclure(id, motif);
        return ResponseEntity.ok().build();
    }
}