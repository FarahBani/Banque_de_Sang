package com.banquesang.controller;

import com.banquesang.model.entity.Stock;
import com.banquesang.model.enums.GroupeSanguin;
import com.banquesang.service.IStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final IStockService stockService;

    @GetMapping
    public ResponseEntity<List<Stock>> findAll() {
        return ResponseEntity.ok(stockService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stock> findById(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.findById(id));
    }

    @GetMapping("/groupe/{groupeSanguin}")
    public ResponseEntity<Stock> findByGroupe(@PathVariable GroupeSanguin groupeSanguin) {
        return ResponseEntity.ok(stockService.findByGroupeSanguin(groupeSanguin));
    }

    @PostMapping
    public ResponseEntity<Stock> creer(@RequestBody Stock stock) {
        return ResponseEntity.ok(stockService.creer(stock));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stock> modifier(@PathVariable Long id,
                                          @RequestBody Stock stock) {
        return ResponseEntity.ok(stockService.modifier(id, stock));
    }

    @PatchMapping("/{id}/ajuster")
    public ResponseEntity<Stock> ajusterQuantite(@PathVariable Long id,
                                                 @RequestParam Integer delta) {
        return ResponseEntity.ok(stockService.ajusterQuantite(id, delta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        stockService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
