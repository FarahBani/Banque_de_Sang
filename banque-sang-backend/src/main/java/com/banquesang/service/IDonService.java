package com.banquesang.service;

import com.banquesang.model.entity.Don;
import com.banquesang.model.entity.Certificat;
import java.util.List;

public interface IDonService {

    // Méthodes métier spécifiques à Don
    Certificat genererCertificat(Long donId);
    void valider(Long donId);
    void exclure(Long donId, String motif);

    // Méthodes CRUD standards
    Don creer(Don don);
    Don modifier(Long id, Don don);
    void supprimer(Long id);
    Don findById(Long id);
    List<Don> findAll();
}
