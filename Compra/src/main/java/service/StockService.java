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

public List<StockEntity> obtenerTodosLosStocks() {
        return stockRepository.findAll();
    }

public Optional<StockEntity> getStockById(Long id) {
        return stockRepository.findById(id);
    }

public StockEntity createStock(StockEntity stock) {
        return stockRepository.save(stock);
    }

public StockEntity updateStock(Long id, StockEntity stock) {
        StockEntity stockExistente = stockRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Stock no encontrado con id: " + id));

        stockExistente.setCantidad(stock.getCantidad());
        if (stock.getPrendaId() != null) {
            stockExistente.setPrendaId(stock.getPrendaId());
        }
        if (stock.getIdSucursal() != null) {
            stockExistente.setIdSucursal(stock.getIdSucursal());
        }
        return stockRepository.save(stockExistente);
    }

public void deleteStock(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        if (!stockRepository.existsById(id)) {
            throw new RuntimeException("Stock no encontrado con id: " + id);
        }
        stockRepository.deleteById(id);
    }

public void descontarStock(Long prendaId, int cantidad) {
        StockEntity stock = stockRepository.findFirstByPrendaId(prendaId)
            .orElseThrow(() -> new RuntimeException(
                "No existe registro de stock para la prenda con id: " + prendaId));

        if (stock.getCantidad() < cantidad) {
            throw new RuntimeException(
                "Stock insuficiente para la prenda con id: " + prendaId +
                ". Disponible: " + stock.getCantidad() +
                ", solicitado: " + cantidad);
        }

        stock.setCantidad(stock.getCantidad() - cantidad);
        stockRepository.save(stock);
    }
}
