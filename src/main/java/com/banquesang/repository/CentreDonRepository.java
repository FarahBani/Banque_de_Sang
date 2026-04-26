package com.banquesang.repository;

import com.banquesang.model.entity.CentreDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CentreDonRepository extends JpaRepository<CentreDon, Long> {

    Optional<CentreDon> findByNom(String nom);
    boolean existsByNom(String nom);
    List<CentreDon> findByActifTrue();
    List<CentreDon> findByActifFalse();
    List<CentreDon> findByAdresseContaining(String ville);
}