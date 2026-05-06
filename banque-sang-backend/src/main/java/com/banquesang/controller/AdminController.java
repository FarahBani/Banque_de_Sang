package com.banquesang.controller;

import com.banquesang.model.entity.Administrateur;
import com.banquesang.service.IAdministrateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminController {

    private final IAdministrateurService administrateurService;

    @GetMapping
    public ResponseEntity<List<Administrateur>> findAll() {
        return ResponseEntity.ok(administrateurService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Administrateur> findById(@PathVariable Long id) {
        return ResponseEntity.ok(administrateurService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Administrateur> creer(@RequestBody Administrateur admin) {
        return ResponseEntity.ok(administrateurService.creer(admin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Administrateur> modifier(@PathVariable Long id,
                                                   @RequestBody Administrateur admin) {
        return ResponseEntity.ok(administrateurService.modifier(id, admin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        administrateurService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}