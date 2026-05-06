package com.banquesang.repository;

import com.banquesang.model.entity.MedecinHopital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedecinHopitalRepository extends JpaRepository<MedecinHopital, Long> {
    Optional<MedecinHopital> findByEmail(String email);
    List<MedecinHopital> findByHopitalId(Long hopitalId);
}
