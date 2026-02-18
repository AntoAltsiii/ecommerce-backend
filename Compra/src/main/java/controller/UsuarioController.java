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

import com.proyecto.Compra.entity.UsuarioEntity;
import com.proyecto.Compra.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;

    // GET - Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<List<UsuarioEntity>> getAllUsuarios() {
        List<UsuarioEntity> usuarios = usuarioService.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    // GET - Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioEntity> getUsuarioById(@PathVariable Long id) {
        return usuarioService.getUsuarioById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // POST - Crear nuevo usuario
    @PostMapping
    public ResponseEntity<UsuarioEntity> createUsuario(@RequestBody UsuarioEntity usuario) {
        try {
            UsuarioEntity nuevoUsuario = usuarioService.createUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // PUT - Actualizar usuario existente
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioEntity> updateUsuario(
            @PathVariable Long id, 
            @RequestBody UsuarioEntity usuarioDetails) {
        try {
            UsuarioEntity usuarioActualizado = usuarioService.updateUsuario(id, usuarioDetails);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        try {
            usuarioService.deleteUsuario(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
