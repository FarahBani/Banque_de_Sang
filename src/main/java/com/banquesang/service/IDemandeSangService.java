package com.banquesang.service;

import com.banquesang.model.entity.DemandeSang;
import java.util.List;

public interface IDemandeSangService {

    // Méthodes métier spécifiques à DemandeSang
    void confirmerReception(Long id);
    void annuler(Long id);

    // Méthodes CRUD standards
    DemandeSang creer(DemandeSang demandeSang);
    DemandeSang modifier(Long id, DemandeSang demandeSang);
    void supprimer(Long id);
    DemandeSang findById(Long id);
    List<DemandeSang> findAll();
}
