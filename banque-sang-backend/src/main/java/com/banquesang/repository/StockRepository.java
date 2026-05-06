package com.banquesang.repository;

import com.banquesang.model.entity.Stock;
import com.banquesang.model.enums.GroupeSanguin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByGroupeSanguin(GroupeSanguin groupeSanguin);
}
