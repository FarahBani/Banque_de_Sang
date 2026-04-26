package com.banquesang.service;

import com.banquesang.model.entity.RendezVous;
import java.util.List;

public interface IRendezVousService {

    // Méthodes métier spécifiques à RendezVous
    void confirmer(Long id);
    void annuler(Long id);
    void reprogrammer(Long id, java.time.LocalDateTime nouvelleDate);
    void envoyerRappel(Long id);

    // Méthodes CRUD standards
    RendezVous creer(RendezVous rendezVous);
    RendezVous modifier(Long id, RendezVous rendezVous);
    void supprimer(Long id);
    RendezVous findById(Long id);
    List<RendezVous> findAll();
}
