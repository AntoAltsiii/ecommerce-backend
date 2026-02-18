package com.proyecto.Compra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.Compra.entity.SucursalEntity;

	@Repository
	public interface SucursalRepository extends JpaRepository<SucursalEntity, Long>{
		boolean existsByTelefonoSucursalAndIdSucursalNot(String telefonoSucursal, Long idSucursal);
	}
