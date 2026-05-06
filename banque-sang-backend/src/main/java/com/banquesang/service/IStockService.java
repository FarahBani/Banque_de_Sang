package com.banquesang.service;

import com.banquesang.model.entity.Stock;
import com.banquesang.model.enums.GroupeSanguin;
import java.util.List;

public interface IStockService {

    // Méthodes métier
    Stock findByGroupeSanguin(GroupeSanguin groupeSanguin);
    Stock ajusterQuantite(Long id, Integer delta);

    // CRUD standards
    Stock creer(Stock stock);
    Stock modifier(Long id, Stock stock);
    void supprimer(Long id);
    Stock findById(Long id);
    List<Stock> findAll();
}