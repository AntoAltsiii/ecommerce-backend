package com.proyecto.Compra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.Compra.entity.EnvioEntity;

	@Repository
	public interface EnvioRepository extends JpaRepository<EnvioEntity, Long>{

	}
