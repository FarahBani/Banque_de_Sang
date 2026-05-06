package com.banquesang.controller;

import com.banquesang.model.entity.Donneur;
import com.banquesang.service.IDonneurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donneurs")
@RequiredArgsConstructor  // génère le constructeur avec injection propre
public class DonneurController {

    private final IDonneurService donneurService;  // final = injection par constructeur

    @GetMapping
    public ResponseEntity<List<Donneur>> findAll() {
        return ResponseEntity.ok(donneurService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donneur> findById(@PathVariable Long id) {
        return ResponseEntity.ok(donneurService.findById(id));  // throws 404 auto via service
    }

    @PostMapping
    public ResponseEntity<Donneur> creer(@RequestBody Donneur donneur) {
        return ResponseEntity.ok(donneurService.creer(donneur));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donneur> modifier(@PathVariable Long id,
                                            @RequestBody Donneur donneur) {
        return ResponseEntity.ok(donneurService.modifier(id, donneur));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        donneurService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}