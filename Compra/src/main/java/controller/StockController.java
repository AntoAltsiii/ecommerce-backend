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

import com.proyecto.Compra.entity.StockEntity;
import com.proyecto.Compra.service.StockService;

@RestController
@RequestMapping("/api/stock")
public class StockController {
    
    @Autowired
    private StockService stockService;

    // GET - Obtener todos los stocks
    @GetMapping
    public ResponseEntity<List<StockEntity>> obtenerTodosLosStocks() {
        List<StockEntity> stocks = stockService.obtenerTodosLosStocks();
        return ResponseEntity.ok(stocks);
    }

    // GET - Obtener stock por ID
    @GetMapping("/{id}")
    public ResponseEntity<StockEntity> getStockById(@PathVariable Long id) {
        return stockService.getStockById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // POST - Crear nuevo stock
    @PostMapping
    public ResponseEntity<StockEntity> createStock(@RequestBody StockEntity stock) {
        StockEntity nuevoStock = stockService.createStock(stock);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoStock);
    }

    // PUT - Actualizar stock existente
    @PutMapping("/{id}")
    public ResponseEntity<StockEntity> updateStock(
            @PathVariable Long id, 
            @RequestBody StockEntity stockDetails) {
        try {
            StockEntity stockActualizado = stockService.updateStock(id, stockDetails);
            return ResponseEntity.ok(stockActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Eliminar stock
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        try {
            stockService.deleteStock(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
