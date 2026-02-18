package com.proyecto.Compra.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.Compra.entity.ItemEntity;
import com.proyecto.Compra.repository.ItemRepository;
import com.proyecto.Compra.client.ProductoClient;
import com.proyecto.Compra.dto.PrendaDTO;

@Service
public class ItemService {
    
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ProductoClient productoClient;

    // Obtener todos los items
    public List<ItemEntity> obtenerTodosLosItems() {
        return itemRepository.findAll();
    }

    // Obtener item por ID
    public Optional<ItemEntity> getItemById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        return itemRepository.findById(id);
    }

    // Crear nuevo item CON VALIDACIÓN
    public ItemEntity createItem(ItemEntity item) {
        // 1. Validar que la prenda existe en Producto MS
        PrendaDTO prenda = productoClient.obtenerPrendaPorId(item.getPrendaId());
        
        if (prenda == null) {
            throw new RuntimeException("La prenda con id " + item.getPrendaId() + " no existe");
        }

        // 2. Obtener precio real desde Producto MS
        Double precioReal = productoClient.obtenerPrecioPrenda(item.getPrendaId());
        item.setPrecioUnitario(precioReal);
        
        // 3. Calcular subtotal
        item.setSubtotal(precioReal * item.getCantidad());

        return itemRepository.save(item);
    }

    // Actualizar item existente
    public ItemEntity updateItem(Long id, ItemEntity item) {
        ItemEntity itemExistente = itemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item no encontrado con id: " + id));
        
        // Si cambió la prenda, validar que existe
        if (!itemExistente.getPrendaId().equals(item.getPrendaId())) {
            PrendaDTO prenda = productoClient.obtenerPrendaPorId(item.getPrendaId());
            if (prenda == null) {
                throw new RuntimeException("La prenda con id " + item.getPrendaId() + " no existe");
            }
            // Actualizar precio con el de Producto MS
            Double precioReal = productoClient.obtenerPrecioPrenda(item.getPrendaId());
            item.setPrecioUnitario(precioReal);
        }
        
        itemExistente.setCantidad(item.getCantidad());
        itemExistente.setPrecioUnitario(item.getPrecioUnitario());
        itemExistente.setSubtotal(item.getPrecioUnitario() * item.getCantidad());
        itemExistente.setPrendaId(item.getPrendaId());
        
        if (item.getCompra() != null) {
            itemExistente.setCompra(item.getCompra());
        }
        
        return itemRepository.save(itemExistente);
    }

    // Eliminar item
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item no encontrado con id: " + id);
        }
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        itemRepository.deleteById(id);
    }
}
