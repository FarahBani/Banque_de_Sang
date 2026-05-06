package com.banquesang.service;

import com.banquesang.model.dto.DemandeSangDTO;
import com.banquesang.model.entity.DemandeSang;
import java.util.List;

public interface IDemandeSangService {

    void confirmerReception(Long id);
    void annuler(Long id);

    DemandeSang creer(DemandeSang demandeSang);
    DemandeSang modifier(Long id, DemandeSang demandeSang);
    void supprimer(Long id);
    DemandeSang findById(Long id);
    List<DemandeSang> findAll();

    // Nouvelles méthodes pour le dashboard hôpital
    List<DemandeSangDTO> getDemandesByHopital(Long hopitalId);
    DemandeSangDTO updateStatut(Long id, String statut);
    void deleteDemande(Long id);
}