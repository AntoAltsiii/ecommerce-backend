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

import com.proyecto.Compra.entity.PagoEntity;
import com.proyecto.Compra.service.PagoService;

@RestController
@RequestMapping("/api/pago")
public class PagoController {

    @Autowired
    private PagoService pagoService;

@GetMapping
    public ResponseEntity<List<PagoEntity>> obtenerTodosLosPagos() {
        List<PagoEntity> pagos = pagoService.obtenerTodosLosPagos();
        return ResponseEntity.ok(pagos);
    }

@GetMapping("/{id}")
    public ResponseEntity<PagoEntity> getPagoById(@PathVariable Long id) {
        return pagoService.getPagoById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

@PostMapping
    public ResponseEntity<PagoEntity> createPago(@RequestBody PagoEntity pago) {
        PagoEntity nuevoPago = pagoService.createPago(pago);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPago);
    }

@PutMapping("/{id}")
    public ResponseEntity<PagoEntity> updatePago(
            @PathVariable Long id,
            @RequestBody PagoEntity pagoDetails) {
        try {
            PagoEntity pagoActualizado = pagoService.updatePago(id, pagoDetails);
            return ResponseEntity.ok(pagoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

@DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePago(@PathVariable Long id) {
        try {
            pagoService.deletePago(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
