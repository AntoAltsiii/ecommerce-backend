package com.proyecto.Compra.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.Compra.entity.StockEntity;
import com.proyecto.Compra.repository.StockRepository;

@Service
public class StockService {
    
    @Autowired
    private StockRepository stockRepository;

    // Obtener todos los stocks
    public List<StockEntity> obtenerTodosLosStocks() {
        return stockRepository.findAll();
    }

    // Obtener stock por ID
    public Optional<StockEntity> getStockById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        return stockRepository.findById(id);
    }

    // Crear nuevo stock
    public StockEntity createStock(StockEntity stock) {
        return stockRepository.save(stock);
    }

    // Actualizar stock existente
    public StockEntity updateStock(Long id, StockEntity stock) {
        StockEntity stockExistente = stockRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Stock no encontrado con id: " + id));
        
        stockExistente.setCantidad(stock.getCantidad());
        if (stock.getSucursal() != null) {
            stockExistente.setSucursal(stock.getSucursal());
        }
        return stockRepository.save(stockExistente);
    }

    // Eliminar stock
    public void deleteStock(Long id) {
        if (!stockRepository.existsById(id)) {
            throw new RuntimeException("Stock no encontrado con id: " + id);
        } if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        stockRepository.deleteById(id);
    }
}
