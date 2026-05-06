package com.banquesang.service.impl;

import com.banquesang.exception.ResourceNotFoundException;
import com.banquesang.model.entity.Administrateur;
import com.banquesang.repository.AdministrateurRepository;
import com.banquesang.service.IAdministrateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AdministrateurServiceImpl implements IAdministrateurService {

    private final AdministrateurRepository administrateurRepository;

    @Override
    public Administrateur creer(Administrateur admin) {
        return administrateurRepository.save(admin);
    }

    @Override
    public Administrateur modifier(Long id, Administrateur admin) {
        Administrateur existant = findById(id);
        existant.setNom(admin.getNom());
        existant.setPrenom(admin.getPrenom());
        existant.setEmail(admin.getEmail());
        existant.setTelephone(admin.getTelephone());
        existant.setNiveauAcces(admin.getNiveauAcces());
        return administrateurRepository.save(existant);
    }

    @Override
    public void supprimer(Long id) {
        findById(id);
        administrateurRepository.deleteById(id);
    }

    @Override
    public Administrateur findById(Long id) {
        return administrateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Administrateur introuvable avec id : " + id));
    }

    @Override
    public List<Administrateur> findAll() {
        return administrateurRepository.findAll();
    }
}

