package com.proyecto.Producto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.Producto.entity.CategoriaEntity;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaEntity, Long> {
    
    boolean existsByNombreCategoria(String nombreCategoria);

    boolean existsByNombreCategoriaAndIdCategoriaNot(String nombreCategoria, Long idCategoria);

}
