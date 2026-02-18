package com.proyecto.Compra.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.Compra.entity.SucursalEntity;
import com.proyecto.Compra.repository.SucursalRepository;

@Service
public class SucursalService {
    
    @Autowired
    private SucursalRepository sucursalRepository;

    // Obtener todas las sucursales
    public List<SucursalEntity> obtenerTodasLasSucursales() {
        return sucursalRepository.findAll();
    }

    // Obtener sucursal por ID
    public Optional<SucursalEntity> getSucursalById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        } if (!sucursalRepository.existsById(id)) {
            throw new RuntimeException("Sucursal no encontrada con id: " + id);
        }
        return sucursalRepository.findById(id);
    }

    // Crear nueva sucursal
    public SucursalEntity createSucursal(SucursalEntity sucursal) {
        // Validaciones
        if (sucursal.getNombreSucursal() == null || sucursal.getNombreSucursal().isEmpty()) {
            throw new RuntimeException("El nombre de la sucursal no puede estar vacío");
        }
        if (sucursal.getTelefonoSucursal() == null || sucursal.getTelefonoSucursal().isEmpty()) {
            throw new RuntimeException("El teléfono de la sucursal no puede estar vacío");
        }
        return sucursalRepository.save(sucursal);
    }

    // Actualizar sucursal existente
    public SucursalEntity updateSucursal(Long id, SucursalEntity sucursal) {
        // Validar que el teléfono no esté en uso por otra sucursal
        if (sucursalRepository.existsByTelefonoSucursalAndIdSucursalNot(sucursal.getTelefonoSucursal(), id)) {
            throw new RuntimeException("El teléfono: " + sucursal.getTelefonoSucursal() + " ya está en uso por otra sucursal.");
        }
        
        SucursalEntity sucursalExistente = sucursalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sucursal no encontrada con id: " + id));
        
        sucursalExistente.setNombreSucursal(sucursal.getNombreSucursal());
        sucursalExistente.setDireccionSucursal(sucursal.getDireccionSucursal());
        sucursalExistente.setTelefonoSucursal(sucursal.getTelefonoSucursal());
        
        return sucursalRepository.save(sucursalExistente);
    }

    // Eliminar sucursal
    public void deleteSucursal(Long id) {
        if (!sucursalRepository.existsById(id)) {
            throw new RuntimeException("Sucursal no encontrada con id: " + id);
        } if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        sucursalRepository.deleteById(id);
    }
    
    // Métodos adicionales específicos de negocio
    
    public SucursalEntity obtenerSucursalPorId(Long id) {
        return sucursalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sucursal no encontrada con id: " + id));
    }

}
