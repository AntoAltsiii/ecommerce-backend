package com.proyecto.Compra.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.Compra.entity.CompraEntity;
import com.proyecto.Compra.service.CompraService;

@RestController
@RequestMapping("/api/compras")
public class CompraController {
    
    @Autowired
    private CompraService compraService;

    // GET - Obtener todas las compras
    @GetMapping
    public ResponseEntity<List<CompraEntity>> obtenerTodasLasCompras() {
        List<CompraEntity> compras = compraService.obtenerTodasLasCompras();
        return ResponseEntity.ok(compras);
    }

    // GET - Obtener compra por ID
    @GetMapping("/{id}")
    public ResponseEntity<CompraEntity> getCompraById(@PathVariable Long id) {
        return compraService.getCompraById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // POST - Crear nueva compra
    @PostMapping
    public ResponseEntity<CompraEntity> createCompra(@RequestBody CompraEntity compra) {
        CompraEntity nuevaCompra = compraService.createCompra(compra);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCompra);
    }

    // PUT - Actualizar compra existente
    @PutMapping("/{id}")
    public ResponseEntity<CompraEntity> updateCompra(
            @PathVariable Long id, 
            @RequestBody CompraEntity compraDetails) {
        try {
            CompraEntity compraActualizada = compraService.updateCompra(id, compraDetails);
            return ResponseEntity.ok(compraActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Eliminar compra
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompra(@PathVariable Long id) {
        try {
            compraService.deleteCompra(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
