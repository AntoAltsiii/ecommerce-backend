package com.proyecto.Producto.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import java.util.List;

import com.proyecto.Producto.entity.CategoriaEntity;
import com.proyecto.Producto.service.CategoriaService;

@RestController //quiere decir que esta clase expone endpoints y devuelve datos, nada de vistas HTML (controller + Responsebody)
@RequestMapping("/api/categorias")
public class CategoriaController {
    //responseEntity es para contorlar la respuesta HTTP (codigos de estado, headers, body), clase de java, HTTP 200 OK
    //Body: { ... }

    @Autowired
    private CategoriaService categoriaService;

    @PostMapping
    public ResponseEntity<String> crearCategoria(@RequestBody CategoriaEntity categoria) {
        String nuevaCategoria = categoriaService.crearCategoria(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria);
    }

    @GetMapping
    public ResponseEntity<List<CategoriaEntity>> obtenerTodasLasCategorias() {
        List<CategoriaEntity> categorias = categoriaService.obtenerTodasLasCategorias();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaEntity> obtenerCategoriaPorIdCategoria(@PathVariable("id") Long idCategoria) {
        CategoriaEntity categoria = categoriaService.obtenerCategoriaPorIdCategoria(idCategoria);
        return ResponseEntity.ok(categoria);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarCategoria(@PathVariable("id") Long idCategoria) {
        String respuesta = categoriaService.eliminarCategoria(idCategoria);
        return ResponseEntity.ok(respuesta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualziarCategoria(
        @PathVariable("id") Long idCategoria, @RequestBody CategoriaEntity categoria) {
            try {
                String categoriaActualizada = categoriaService.actualizarCategoria(idCategoria, categoria);
                return ResponseEntity.ok(categoriaActualizada);
            } catch (RuntimeException e) {
                return ResponseEntity.notFound().build();
            }
        }

}