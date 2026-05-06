package com.banquesang.service;

import com.banquesang.model.entity.CentreDon;
import java.util.List;

public interface ICentreDonService {
    CentreDon creer(CentreDon centreDon);
    CentreDon modifier(Long id, CentreDon centreDon);
    void supprimer(Long id);
    CentreDon findById(Long id);
    List<CentreDon> findAll();
}