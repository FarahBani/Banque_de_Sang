package com.banquesang.service.impl;

import com.banquesang.exception.ResourceNotFoundException;
import com.banquesang.model.entity.Donneur;
import com.banquesang.model.entity.RendezVous;
import com.banquesang.repository.DonneurRepository;
import com.banquesang.service.IDonneurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DonneurServiceImpl implements IDonneurService {

    private final DonneurRepository donneurRepository;

    @Override
    public Donneur creer(Donneur donneur) {
        return donneurRepository.save(donneur);
    }

    @Override
    public Donneur modifier(Long id, Donneur donneur) {
        Donneur existant = findById(id);
        existant.setNom(donneur.getNom());
        existant.setPrenom(donneur.getPrenom());
        existant.setEmail(donneur.getEmail());
        existant.setTelephone(donneur.getTelephone());
        existant.setGroupeSanguin(donneur.getGroupeSanguin());
        existant.setDateNaissance(donneur.getDateNaissance());
        existant.setPoids(donneur.getPoids());
        existant.setAdresse(donneur.getAdresse());
        existant.setBadge(donneur.getBadge());
        existant.setEligible(donneur.getEligible());
        return donneurRepository.save(existant);
    }

    @Override
    public void supprimer(Long id) {
        findById(id);
        donneurRepository.deleteById(id);
    }

    @Override
    public Donneur findById(Long id) {
        return donneurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Donneur introuvable avec id : " + id));
    }

    @Override
    public List<Donneur> findAll() {
        return donneurRepository.findAll();
    }

    @Override
    public List<RendezVous> consulterHistoriqueRdv(Long donneurId) {
        return findById(donneurId).getRendezVous();
    }

    @Override
    public void annulerRendezVous(Long rendezVousId) {
        throw new UnsupportedOperationException("À implémenter");
    }
}
