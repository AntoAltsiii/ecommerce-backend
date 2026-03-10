package com.proyecto.Compra.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.Compra.entity.CompraEntity;

@Repository
public interface CompraRepository extends JpaRepository<CompraEntity, Long> {

List<CompraEntity> findByUsuario_IdUsuario(Long usuarioId);
}
