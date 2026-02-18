package com.proyecto.Compra.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.Compra.entity.UsuarioEntity;
import com.proyecto.Compra.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todos los usuarios
    public List<UsuarioEntity> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // Obtener usuario por ID
    public Optional<UsuarioEntity> getUsuarioById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        } if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("El usuario con el id: " + id + " no existe en el sistema.");
        }
        return usuarioRepository.findById(id);
    }

    // Crear nuevo usuario
    public UsuarioEntity createUsuario(UsuarioEntity usuario) {
        // Validaciones
        if (usuario.getNombre() == null || usuario.getNombre().isEmpty()) {
            throw new RuntimeException("El nombre del usuario no puede estar vacío");
        }
        if (usuario.getEmail() == null || usuario.getEmail().isEmpty()) {
            throw new RuntimeException("El email del usuario no puede estar vacío");
        }
        return usuarioRepository.save(usuario);
    }

    // Actualizar usuario existente
    public UsuarioEntity updateUsuario(Long id, UsuarioEntity usuario) {
        // Validar que el email no esté en uso por otro usuario
        if (usuarioRepository.existsByEmailAndIdUsuarioNot(usuario.getEmail(), id)) {
            throw new RuntimeException("El email: " + usuario.getEmail() + " ya está en uso por otro usuario.");
        }
        
        UsuarioEntity usuarioExistente = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
        
        usuarioExistente.setNombre(usuario.getNombre());
        usuarioExistente.setApellido(usuario.getApellido());
        usuarioExistente.setEmail(usuario.getEmail());
        usuarioExistente.setDireccion(usuario.getDireccion());
        
        return usuarioRepository.save(usuarioExistente);
    }

    // Eliminar usuario
    public void deleteUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        } if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        usuarioRepository.deleteById(id);
    }
    
    // Métodos adicionales específicos de negocio
    
    public UsuarioEntity obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    public List<UsuarioEntity> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }
}


