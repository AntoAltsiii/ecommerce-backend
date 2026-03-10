package com.proyecto.Compra.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.Compra.entity.StockEntity;

@Repository
public interface StockRepository extends JpaRepository<StockEntity, Long> {

Optional<StockEntity> findFirstByPrendaId(Long prendaId);
}
