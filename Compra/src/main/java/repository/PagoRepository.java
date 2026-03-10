package com.proyecto.Compra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.Compra.entity.PagoEntity;

	@Repository
	public interface PagoRepository extends JpaRepository<PagoEntity, Long>{

	}
