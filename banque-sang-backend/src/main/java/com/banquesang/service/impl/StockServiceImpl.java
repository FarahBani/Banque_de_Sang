package com.banquesang.service.impl;

import com.banquesang.exception.ResourceNotFoundException;
import com.banquesang.model.entity.Stock;
import com.banquesang.model.enums.GroupeSanguin;
import com.banquesang.repository.StockRepository;
import com.banquesang.service.IStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StockServiceImpl implements IStockService {

    private final StockRepository stockRepository;

    @Override
    public Stock creer(Stock stock) {
        if (stock.getQuantiteDisponible() == null) stock.setQuantiteDisponible(0);
        if (stock.getSeuilMinimum() == null) stock.setSeuilMinimum(10);
        return stockRepository.save(stock);
    }

    @Override
    public Stock modifier(Long id, Stock stock) {
        Stock existant = findById(id);
        existant.setGroupeSanguin(stock.getGroupeSanguin());
        existant.setQuantiteDisponible(stock.getQuantiteDisponible());
        existant.setSeuilMinimum(stock.getSeuilMinimum());
        existant.setEstCritique(stock.getEstCritique());
        existant.setLocalisation(stock.getLocalisation());
        return stockRepository.save(existant);
    }

    @Override
    public void supprimer(Long id) {
        findById(id);
        stockRepository.deleteById(id);
    }

    @Override
    public Stock findById(Long id) {
        return stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock introuvable avec id : " + id));
    }

    @Override
    public List<Stock> findAll() {
        return stockRepository.findAll();
    }

    @Override
    public Stock findByGroupeSanguin(GroupeSanguin groupeSanguin) {
        return stockRepository.findByGroupeSanguin(groupeSanguin)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock introuvable pour le groupe : " + groupeSanguin));
    }

    @Override
    public Stock ajusterQuantite(Long id, Integer delta) {
        Stock stock = findById(id);
        int nouvelleQte = (stock.getQuantiteDisponible() == null ? 0 : stock.getQuantiteDisponible()) + delta;
        if (nouvelleQte < 0) nouvelleQte = 0;
        stock.setQuantiteDisponible(nouvelleQte);
        return stockRepository.save(stock);
    }
}
