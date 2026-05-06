package com.banquesang.repository;

import com.banquesang.model.entity.AgentBanque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentBanqueRepository extends JpaRepository<AgentBanque, Long> {
    Optional<AgentBanque> findByEmail(String email);
    List<AgentBanque> findByCentreDonId(Long centreDonId);
}