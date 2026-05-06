package com.banquesang.controller;

import com.banquesang.model.entity.CentreDon;
import com.banquesang.service.ICentreDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/centres-don")
@RequiredArgsConstructor
public class CentreDonController {

    private final ICentreDonService centreDonService;

    @GetMapping
    public ResponseEntity<List<CentreDon>> findAll() {
        return ResponseEntity.ok(centreDonService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CentreDon> findById(@PathVariable Long id) {
        return ResponseEntity.ok(centreDonService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CentreDon> creer(@RequestBody CentreDon centreDon) {
        return ResponseEntity.ok(centreDonService.creer(centreDon));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CentreDon> modifier(@PathVariable Long id,
                                              @RequestBody CentreDon centreDon) {
        return ResponseEntity.ok(centreDonService.modifier(id, centreDon));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        centreDonService.supprimer(id);
        return ResponseEntity.noContent().build();

    }}
