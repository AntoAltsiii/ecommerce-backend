package com.proyecto.Producto.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyecto.Producto.entity.PrendasEntity;

@Repository
public interface PrendasRepository extends JpaRepository<PrendasEntity, Long>{
    
    boolean existsByNombre(String nombre);

    boolean existsByNombreAndIdNot(String nombre, Long id); //queremos actualizar una prenda pero que no se confunda con el id de la actual
    //en caso de q no ande muy bien
    // sin método exists personalizado
/* var opt = prendasRepository.findByNombre(nombre);
if (opt.isPresent() && !opt.get().getId().equals(id)) { /* conflicto */


    Optional<PrendasEntity> findByNombre(String nombre);

    // Buscar prendas por nombre de categoría
    @Query("SELECT p FROM PrendasEntity p WHERE LOWER(p.categoria.nombreCategoria) = LOWER(:nombreCategoria)")
    List<PrendasEntity> findByCategoriaNombre(@Param("nombreCategoria") String nombreCategoria);

}
