package com.banquesang.service.impl;

import com.banquesang.exception.ResourceNotFoundException;
import com.banquesang.model.entity.Certificat;
import com.banquesang.model.entity.Don;
import com.banquesang.model.enums.StatutDon;
import com.banquesang.repository.DonRepository;
import com.banquesang.service.IDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DonServiceImpl implements IDonService {

    private final DonRepository donRepository;

    @Override
    public Don creer(Don don) {
        don.setStatut(StatutDon.EN_ATTENTE);
        return donRepository.save(don);
    }

    @Override
    public Don modifier(Long id, Don don) {
        Don existant = findById(id);
        existant.setQuantite(don.getQuantite());
        existant.setLieu(don.getLieu());
        existant.setCommentaire(don.getCommentaire());
        existant.setStatut(don.getStatut());
        return donRepository.save(existant);
    }

    @Override
    public void supprimer(Long id) {
        findById(id);
        donRepository.deleteById(id);
    }

    @Override
    public Don findById(Long id) {
        return donRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Don introuvable avec id : " + id));
    }

    @Override
    public List<Don> findAll() {
        return donRepository.findAll();
    }

    @Override
    public void valider(Long donId) {
        Don don = findById(donId);
        don.setStatut(StatutDon.VALIDE);
        donRepository.save(don);
    }

    @Override
    public void exclure(Long donId, String motif) {
        Don don = findById(donId);
        don.setStatut(StatutDon.REJETE);
        don.setCommentaire(motif);
        donRepository.save(don);
    }

    @Override
    public Certificat genererCertificat(Long donId) {
        throw new UnsupportedOperationException("À implémenter");
    }
}