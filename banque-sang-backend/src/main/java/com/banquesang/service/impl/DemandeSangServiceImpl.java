package com.banquesang.service.impl;

import com.banquesang.exception.ResourceNotFoundException;
import com.banquesang.model.dto.DemandeSangDTO;
import com.banquesang.model.entity.DemandeSang;
import com.banquesang.repository.DemandeSangRepository;
import com.banquesang.service.IDemandeSangService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class DemandeSangServiceImpl implements IDemandeSangService {

    private final DemandeSangRepository demandeSangRepository;

    // ========== MÉTHODES EXISTANTES ==========

    @Override
    public DemandeSang creer(DemandeSang demandeSang) {
        return demandeSangRepository.save(demandeSang);
    }

    @Override
    public DemandeSang modifier(Long id, DemandeSang demandeSang) {
        DemandeSang existant = findById(id);
        existant.setQuantiteDemandee(demandeSang.getQuantiteDemandee());
        existant.setGroupeSanguin(demandeSang.getGroupeSanguin());
        existant.setPriorite(demandeSang.getPriorite());
        existant.setStatut(demandeSang.getStatut());
        existant.setDescription(demandeSang.getDescription());
        existant.setDateRequise(demandeSang.getDateRequise());
        return demandeSangRepository.save(existant);
    }

    @Override
    public void supprimer(Long id) {
        findById(id);
        demandeSangRepository.deleteById(id);
    }

    @Override
    public DemandeSang findById(Long id) {
        return demandeSangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Demande introuvable avec id : " + id));
    }

    @Override
    public List<DemandeSang> findAll() {
        return demandeSangRepository.findAll();
    }

    @Override
    public void confirmerReception(Long id) {
        findById(id);
    }

    @Override
    public void annuler(Long id) {
        findById(id);
    }

    // ========== NOUVELLES MÉTHODES POUR LE CONTROLLER ==========

    // Récupérer les demandes par hôpital (retourne des DTO)
    @Override
    public List<DemandeSangDTO> getDemandesByHopital(Long hopitalId) {
        List<DemandeSang> demandes = demandeSangRepository.findByHopitalId(hopitalId);
        return demandes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Mettre à jour le statut d'une demande
    @Override
    public DemandeSangDTO updateStatut(Long id, String statut) {
        DemandeSang demande = findById(id);
        demande.setStatut(statut);
        DemandeSang updated = demandeSangRepository.save(demande);
        return convertToDTO(updated);
    }

    // Supprimer une demande (alias de supprimer)
    @Override
    public void deleteDemande(Long id) {
        supprimer(id);
    }

    // ========== MÉTHODES DE CONVERSION ==========

    private DemandeSangDTO convertToDTO(DemandeSang demande) {
        DemandeSangDTO dto = new DemandeSangDTO();
        dto.setId(demande.getId());
        dto.setGroupeSanguin(demande.getGroupeSanguin() != null ? demande.getGroupeSanguin().toString() : null);
        dto.setQuantiteDemandee(demande.getQuantiteDemandee());
        dto.setPriorite(demande.getPriorite() != null ? demande.getPriorite().toString() : null);
        dto.setDateDemande(demande.getDateDemande());
        dto.setDateRequise(demande.getDateRequise());
        dto.setStatut(demande.getStatut());
        dto.setDescription(demande.getDescription());

        // Ajouter le nom de l'hôpital si disponible
        if (demande.getMedecinHopital() != null && demande.getMedecinHopital().getHopital() != null) {
            dto.setNomHopital(demande.getMedecinHopital().getHopital().getNom());
        }

        return dto;
    }
}