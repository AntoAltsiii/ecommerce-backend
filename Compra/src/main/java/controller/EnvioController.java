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

import com.proyecto.Compra.entity.EnvioEntity;
import com.proyecto.Compra.service.EnvioService;

@RestController
@RequestMapping("/api/envio")
public class EnvioController {

    @Autowired
    private EnvioService envioService;

@GetMapping
    public ResponseEntity<List<EnvioEntity>> obtenerTodosLosEnvios() {
        List<EnvioEntity> envios = envioService.obtenerTodosLosEnvios();
        return ResponseEntity.ok(envios);
    }

@GetMapping("/{id}")
    public ResponseEntity<EnvioEntity> getEnvioById(@PathVariable Long id) {
        return envioService.getEnvioById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

@PostMapping
    public ResponseEntity<EnvioEntity> createEnvio(@RequestBody EnvioEntity envio) {
        EnvioEntity nuevoEnvio = envioService.createEnvio(envio);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEnvio);
    }

@PutMapping("/{id}")
    public ResponseEntity<EnvioEntity> updateEnvio(
            @PathVariable Long id,
            @RequestBody EnvioEntity envioDetails) {
        try {
            EnvioEntity envioActualizado = envioService.updateEnvio(id, envioDetails);
            return ResponseEntity.ok(envioActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

@DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnvio(@PathVariable Long id) {
        try {
            envioService.deleteEnvio(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
