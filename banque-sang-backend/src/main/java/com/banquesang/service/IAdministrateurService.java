package com.banquesang.service;

import com.banquesang.model.entity.Administrateur;
import java.util.List;

public interface IAdministrateurService {
    Administrateur creer(Administrateur admin);
    Administrateur modifier(Long id, Administrateur admin);
    void supprimer(Long id);
    Administrateur findById(Long id);
    List<Administrateur> findAll();
}