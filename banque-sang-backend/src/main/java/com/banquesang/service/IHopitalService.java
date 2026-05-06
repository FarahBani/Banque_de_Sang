package com.banquesang.service;

import com.banquesang.model.entity.Hopital;
import java.util.List;

public interface IHopitalService {
    Hopital creer(Hopital hopital);
    Hopital modifier(Long id, Hopital hopital);
    void supprimer(Long id);
    Hopital findById(Long id);
    List<Hopital> findAll();
    List<Hopital> findAvecConvention();
    Hopital changerConvention(Long id, boolean active);
}
