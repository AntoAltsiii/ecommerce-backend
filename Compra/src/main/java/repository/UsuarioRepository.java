package com.proyecto.Compra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.Compra.entity.UsuarioEntity;

	@Repository
	public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long>{
		boolean existsByEmailAndIdUsuarioNot(String email, Long idUsuario);	
	}
