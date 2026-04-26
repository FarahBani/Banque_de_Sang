package com.banquesang.service;

import com.banquesang.model.entity.Donneur;
import com.banquesang.model.entity.RendezVous;
import java.util.List;

public interface IDonneurService {

    // Méthodes métier spécifiques à Donneur
    List<RendezVous> consulterHistoriqueRdv(Long donneurId);
    void annulerRendezVous(Long rendezVousId);

    // Méthodes CRUD standards
    Donneur creer(Donneur donneur);
    Donneur modifier(Long id, Donneur donneur);
    void supprimer(Long id);
    Donneur findById(Long id);
    List<Donneur> findAll();
}
