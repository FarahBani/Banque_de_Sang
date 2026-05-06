package com.banquesang.repository;

import com.banquesang.model.entity.Donneur;
import com.banquesang.model.enums.GroupeSanguin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonneurRepository extends JpaRepository<Donneur, Long> {
    List<Donneur> findByGroupeSanguin(GroupeSanguin groupeSanguin);
    List<Donneur> findByEligibleTrue();
}