package com.proyecto.Producto.controller;

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

import com.proyecto.Producto.entity.PrendasEntity;
import com.proyecto.Producto.service.PrendasService;

@RestController
@RequestMapping("/api/prendas")
public class PrendasController {

    @Autowired
    private PrendasService prendasService;

    @PostMapping
    public ResponseEntity<String> crearPrenda(@RequestBody PrendasEntity prenda) {
        try {
        String nuevaPrenda = prendasService.crearPrenda(prenda);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPrenda);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
    }
    }

    @GetMapping
    public ResponseEntity<List<PrendasEntity>> obtenerTodasLasPrendas() {
        List<PrendasEntity> prendas = prendasService.obtenerTodasLasPrendas();
        return ResponseEntity.ok(prendas);
     }

    @GetMapping("/{id}")
     public ResponseEntity<PrendasEntity> obtenerPrendaPorId(@PathVariable Long id) {
        return prendasService.obtenerPrendaPorId(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
     }

    @DeleteMapping("/{id}")
     public ResponseEntity<String> eliminarPrenda(@PathVariable Long id) {
        try {
            String respuesta = prendasService.eliminarPrenda(id);
        return ResponseEntity.ok(respuesta);
        } catch (RuntimeException e) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND)
                         .body(e.getMessage());
        }

     }

    @PutMapping("/{id}")
     public ResponseEntity<String> actualizarPrenda(
        @PathVariable Long id,
        @RequestBody PrendasEntity prenda) {
            try {
                String prendaActualizada = prendasService.actualizarPrenda(id, prenda);
                return ResponseEntity.ok(prendaActualizada);
            } catch (RuntimeException e) {
                return ResponseEntity.notFound().build();
            }
     }

    @GetMapping("/categoria/{nombreCategoria}")
    public ResponseEntity<List<PrendasEntity>> obtenerPrendasPorCategoria(@PathVariable String nombreCategoria) {
        List<PrendasEntity> prendas = prendasService.obtenerPrendasPorCategoria(nombreCategoria);
        return ResponseEntity.ok(prendas);
    }

}
