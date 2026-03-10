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

import com.proyecto.Compra.entity.ItemEntity;
import com.proyecto.Compra.service.ItemService;

@RestController
@RequestMapping("/api/item")
public class ItemController {

    @Autowired
    private ItemService itemService;

@GetMapping
    public ResponseEntity<List<ItemEntity>> obtenerTodosLosItems() {
        List<ItemEntity> items = itemService.obtenerTodosLosItems();
        return ResponseEntity.ok(items);
    }

@GetMapping("/{id}")
    public ResponseEntity<ItemEntity> getItemById(@PathVariable Long id) {
        return itemService.getItemById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

@PostMapping
    public ResponseEntity<ItemEntity> createItem(@RequestBody ItemEntity item) {
        ItemEntity nuevoItem = itemService.createItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoItem);
    }

@PutMapping("/{id}")
    public ResponseEntity<ItemEntity> updateItem(
            @PathVariable Long id,
            @RequestBody ItemEntity itemDetails) {
        try {
            ItemEntity itemActualizado = itemService.updateItem(id, itemDetails);
            return ResponseEntity.ok(itemActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

@DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
