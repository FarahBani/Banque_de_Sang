package com.banquesang.repository;

import com.banquesang.model.entity.RendezVous;
import com.banquesang.model.enums.StatutRDV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    List<RendezVous> findByDonneurId(Long donneurId);
    List<RendezVous> findByStatut(StatutRDV statut);
}