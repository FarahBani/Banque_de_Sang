package com.banquesang.repository;

import com.banquesang.model.entity.Don;
import com.banquesang.model.enums.StatutDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonRepository extends JpaRepository<Don, Long> {
    List<Don> findByDonneurId(Long donneurId);
    List<Don> findByStatut(StatutDon statut);
}