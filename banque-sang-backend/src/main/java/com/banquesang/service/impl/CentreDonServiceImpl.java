package com.banquesang.service.impl;

import com.banquesang.exception.ResourceNotFoundException;
import com.banquesang.model.entity.CentreDon;
import com.banquesang.repository.CentreDonRepository;
import com.banquesang.service.ICentreDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CentreDonServiceImpl implements ICentreDonService {

    private final CentreDonRepository centreDonRepository;

    @Override
    public CentreDon creer(CentreDon centreDon) {
        return centreDonRepository.save(centreDon);
    }

    @Override
    public CentreDon modifier(Long id, CentreDon centreDon) {
        CentreDon existant = findById(id);
        existant.setNom(centreDon.getNom());
        existant.setAdresse(centreDon.getAdresse());
        existant.setTelephone(centreDon.getTelephone());
        existant.setLatitude(centreDon.getLatitude());
        existant.setLongitude(centreDon.getLongitude());
        existant.setHoraires(centreDon.getHoraires());
        existant.setActif(centreDon.getActif());
        return centreDonRepository.save(existant);
    }

    @Override
    public void supprimer(Long id) {
        findById(id);
        centreDonRepository.deleteById(id);
    }

    @Override
    public CentreDon findById(Long id) {
        return centreDonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Centre de don introuvable avec id : " + id));
    }

    @Override
    public List<CentreDon> findAll() {
        return centreDonRepository.findAll();
    }
}