package com.banquesang.service;

import com.banquesang.model.entity.MedecinHopital;
import java.util.List;

public interface IMedecinHopitalService {
    MedecinHopital creer(MedecinHopital medecin);
    MedecinHopital modifier(Long id, MedecinHopital medecin);
    void supprimer(Long id);
    MedecinHopital findById(Long id);
    List<MedecinHopital> findAll();
    List<MedecinHopital> findByHopital(Long hopitalId);
}