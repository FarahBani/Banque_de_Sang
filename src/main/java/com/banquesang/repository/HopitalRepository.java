package com.banquesang.repository;

import com.banquesang.model.entity.Hopital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HopitalRepository extends JpaRepository<Hopital, Long> {
    Optional<Hopital> findByNom(String nom);
    List<Hopital> findByConventionActiveTrue();
    List<Hopital> findByConventionActiveFalse();
    boolean existsByNom(String nom);
    List<Hopital> findByAdresseContaining(String ville);
}