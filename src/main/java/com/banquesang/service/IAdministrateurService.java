package com.banquesang.service;

import com.banquesang.model.entity.Administrateur;
import com.banquesang.model.entity.Rapport;
import java.util.List;

public interface IAdministrateurService {

    // Méthodes métier spécifiques à Administrateur
    Rapport faireStatistiquesGlobales();
    void gererUtilisateurs();
    void gererStock();
    void validerRendezVous();
    void gererPermissions();
    void gererBaseDonnees();
    void consulterLogs();
    void activerDesactiverCompte(Long userId);

    // Méthodes CRUD standards
    Administrateur creer(Administrateur administrateur);
    Administrateur modifier(Long id, Administrateur administrateur);
    void supprimer(Long id);
    Administrateur findById(Long id);
    List<Administrateur> findAll();
}