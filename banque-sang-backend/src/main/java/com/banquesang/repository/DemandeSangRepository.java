package com.banquesang.repository;

import com.banquesang.model.entity.DemandeSang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DemandeSangRepository extends JpaRepository<DemandeSang, Long> {

    // Trouver les demandes par hôpital via le médecin
    @Query("SELECT d FROM DemandeSang d WHERE d.medecinHopital.hopital.id = :hopitalId")
    List<DemandeSang> findByHopitalId(@Param("hopitalId") Long hopitalId);

    // Trouver par statut
    List<DemandeSang> findByStatut(String statut);

    // Compter par statut
    long countByStatut(String statut);
}