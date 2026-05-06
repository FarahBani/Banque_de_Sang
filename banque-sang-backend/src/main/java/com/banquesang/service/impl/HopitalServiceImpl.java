package com.banquesang.service.impl;

import com.banquesang.exception.ResourceNotFoundException;
import com.banquesang.exception.ValidationException;
import com.banquesang.model.entity.Hopital;
import com.banquesang.repository.HopitalRepository;
import com.banquesang.service.IHopitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class HopitalServiceImpl implements IHopitalService {

    private final HopitalRepository hopitalRepository;

    @Override
    public Hopital creer(Hopital hopital) {
        if (hopitalRepository.existsByNom(hopital.getNom()))
            throw new ValidationException(
                "Hôpital déjà existant : " + hopital.getNom());
        return hopitalRepository.save(hopital);
    }

    @Override
    public Hopital modifier(Long id, Hopital hopital) {
        Hopital existant = findById(id);
        existant.setNom(hopital.getNom());
        existant.setAdresse(hopital.getAdresse());
        existant.setTelephone(hopital.getTelephone());
        existant.setEmail(hopital.getEmail());
        existant.setConventionActive(hopital.getConventionActive());
        return hopitalRepository.save(existant);
    }

    @Override
    public void supprimer(Long id) {
        findById(id);
        hopitalRepository.deleteById(id);
    }

    @Override
    public Hopital findById(Long id) {
        return hopitalRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Hôpital introuvable avec id : " + id));
    }

    @Override
    public List<Hopital> findAll() {
        return hopitalRepository.findAll();
    }

    @Override
    public List<Hopital> findAvecConvention() {
        return hopitalRepository.findByConventionActiveTrue();
    }

    @Override
    public Hopital changerConvention(Long id, boolean active) {
        Hopital hopital = findById(id);
        hopital.setConventionActive(active);
        return hopitalRepository.save(hopital);
    }
}