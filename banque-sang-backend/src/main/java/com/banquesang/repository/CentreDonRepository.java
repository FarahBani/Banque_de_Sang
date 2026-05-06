package com.banquesang.repository;

import com.banquesang.model.entity.CentreDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CentreDonRepository extends JpaRepository<CentreDon, Long> {
    // findByVille supprimé — ce champ n'existe pas dans CentreDon
}