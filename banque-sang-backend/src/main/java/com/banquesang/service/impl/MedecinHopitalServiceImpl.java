package com.banquesang.service.impl;

import com.banquesang.exception.ResourceNotFoundException;
import com.banquesang.model.entity.MedecinHopital;
import com.banquesang.repository.MedecinHopitalRepository;
import com.banquesang.service.IMedecinHopitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MedecinHopitalServiceImpl implements IMedecinHopitalService {

    private final MedecinHopitalRepository medecinRepository;

    @Override
    public MedecinHopital creer(MedecinHopital medecin) {
        return medecinRepository.save(medecin);
    }

    @Override
    public MedecinHopital modifier(Long id, MedecinHopital medecin) {
        MedecinHopital existant = findById(id);
        existant.setNom(medecin.getNom());
        existant.setPrenom(medecin.getPrenom());
        existant.setEmail(medecin.getEmail());
        existant.setTelephone(medecin.getTelephone());
        existant.setSpecialite(medecin.getSpecialite());
        existant.setNumeroOrdre(medecin.getNumeroOrdre());
        existant.setServiceHospitalier(medecin.getServiceHospitalier());
        existant.setCertificationTransfusion(medecin.getCertificationTransfusion());
        existant.setHopital(medecin.getHopital());
        return medecinRepository.save(existant);
    }

    @Override
    public void supprimer(Long id) {
        findById(id);
        medecinRepository.deleteById(id);
    }

    @Override
    public MedecinHopital findById(Long id) {
        return medecinRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "MedecinHopital introuvable avec id : " + id));
    }

    @Override
    public List<MedecinHopital> findAll() {
        return medecinRepository.findAll();
    }

    @Override
    public List<MedecinHopital> findByHopital(Long hopitalId) {
        return medecinRepository.findByHopitalId(hopitalId);
    }
}
