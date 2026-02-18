package com.proyecto.Producto.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.Producto.entity.CategoriaEntity;
import com.proyecto.Producto.repository.CategoriaRepository;


@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public String crearCategoria(CategoriaEntity categoria) {
        categoriaRepository.save(categoria);
        return "Categoria creada con exito!";
    }

    public CategoriaEntity obtenerCategoriaPorIdCategoria(Long idCategoria) {
        if (idCategoria == null || !categoriaRepository.existsById(idCategoria)) {
            throw new RuntimeException("Categoria no encontrada con id: " + idCategoria);
        }
        return categoriaRepository.findById(idCategoria).get();
    }

    public List<CategoriaEntity> obtenerTodasLasCategorias() {
        if (categoriaRepository.count() == 0) {
            throw new RuntimeException("No hay categorias en el sistema.");
        }
        return categoriaRepository.findAll();
    }

    public String eliminarCategoria(Long idCategoria) {
        if (!categoriaRepository.existsById(idCategoria)) {
            throw new RuntimeException("La categoria con el id: " + idCategoria + " no existe en el sistema.");
        }
        categoriaRepository.deleteById(idCategoria);
        return "Categoria eliminada con exito!.";
    }

    public String actualizarCategoria(Long idCategoria, CategoriaEntity categoria) {
        if (categoriaRepository.existsByNombreCategoriaAndIdCategoriaNot(categoria.getNombreCategoria(), idCategoria)) {
            throw new RuntimeException("La categoria con el nombre: " + categoria.getNombreCategoria() + " ya existe en el sistema.");
        }
        CategoriaEntity categoriaExistente = categoriaRepository.findById(idCategoria)
        .orElseThrow (() -> new RuntimeException("Categoria no encontrada con dicho id"));

        categoriaExistente.setNombreCategoria(categoria.getNombreCategoria());
        categoriaRepository.save(categoriaExistente);
        return "Categoria actualizada exitosamente.";
    }
}
