package com.proyecto.Compra.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.Compra.entity.SucursalEntity;
import com.proyecto.Compra.service.SucursalService;

@RestController
@RequestMapping("/api/sucursal")
public class SucursalController {
    
    @Autowired
    private SucursalService sucursalService;

    // GET - Obtener todas las sucursales
    @GetMapping
    public ResponseEntity<List<SucursalEntity>> obtenerTodasLasSucursales() {
        List<SucursalEntity> sucursales = sucursalService.obtenerTodasLasSucursales();
        return ResponseEntity.ok(sucursales);
    }

    // GET - Obtener sucursal por ID
    @GetMapping("/{id}")
    public ResponseEntity<SucursalEntity> getSucursalById(@PathVariable Long id) {
        return sucursalService.getSucursalById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // POST - Crear nueva sucursal
    @PostMapping
    public ResponseEntity<SucursalEntity> createSucursal(@RequestBody SucursalEntity sucursal) {
        try {
            SucursalEntity nuevaSucursal = sucursalService.createSucursal(sucursal);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSucursal);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // PUT - Actualizar sucursal existente
    @PutMapping("/{id}")
    public ResponseEntity<SucursalEntity> updateSucursal(
            @PathVariable Long id, 
            @RequestBody SucursalEntity sucursalDetails) {
        try {
            SucursalEntity sucursalActualizada = sucursalService.updateSucursal(id, sucursalDetails);
            return ResponseEntity.ok(sucursalActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Eliminar sucursal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSucursal(@PathVariable Long id) {
        try {
            sucursalService.deleteSucursal(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
