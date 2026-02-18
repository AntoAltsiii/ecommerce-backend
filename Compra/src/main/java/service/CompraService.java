package com.proyecto.Compra.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.Compra.entity.CompraEntity;
import com.proyecto.Compra.entity.UsuarioEntity;
import com.proyecto.Compra.entity.SucursalEntity;
import com.proyecto.Compra.entity.ItemEntity;
import com.proyecto.Compra.entity.EnvioEntity;
import com.proyecto.Compra.entity.PagoEntity;
import com.proyecto.Compra.repository.CompraRepository;
import com.proyecto.Compra.repository.UsuarioRepository;
import com.proyecto.Compra.repository.SucursalRepository;

import jakarta.transaction.Transactional;

@Service
public class CompraService {
    
    @Autowired
    private CompraRepository compraRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private SucursalRepository sucursalRepository;

    // Obtener todas las compras
    public List<CompraEntity> obtenerTodasLasCompras() {
        return compraRepository.findAll();
    }

    // Obtener compra por ID
    public Optional<CompraEntity> getCompraById(Long id) {
        return compraRepository.findById(id);
    }

    // Crear nueva compra
    @Transactional
    public CompraEntity createCompra(CompraEntity compra) {
        // Validar que el usuario existe
        if (compra.getUsuario() != null && compra.getUsuario().getIdUsuario() != null) {
            UsuarioEntity usuario = usuarioRepository.findById(compra.getUsuario().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + compra.getUsuario().getIdUsuario()));
            compra.setUsuario(usuario);
        }
        
        // Validar que la sucursal existe
        if (compra.getSucursal() != null && compra.getSucursal().getIdSucursal() != null) {
            SucursalEntity sucursal = sucursalRepository.findById(compra.getSucursal().getIdSucursal())
                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada con id: " + compra.getSucursal().getIdSucursal()));
            compra.setSucursal(sucursal);
        }
        
        // Establecer referencias bidireccionales para items
        if (compra.getItems() != null && !compra.getItems().isEmpty()) {
            for (ItemEntity item : compra.getItems()) {
                item.setCompra(compra);
            }
        }
        
        // Establecer referencias bidireccionales para envios
        if (compra.getEnvios() != null && !compra.getEnvios().isEmpty()) {
            for (EnvioEntity envio : compra.getEnvios()) {
                envio.setCompra(compra);
            }
        }
        
        // Establecer referencias bidireccionales para pagos
        if (compra.getPagos() != null && !compra.getPagos().isEmpty()) {
            for (PagoEntity pago : compra.getPagos()) {
                pago.setCompra(compra);
            }
        }
        
        return compraRepository.save(compra);
    }

    // Actualizar compra existente
    @Transactional
    public CompraEntity updateCompra(Long id, CompraEntity compra) {
        CompraEntity compraExistente = compraRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Compra no encontrada con id: " + id));
        
        // Actualizar campos básicos si no son nulos
        if (compra.getFechaCompra() != null) {
            compraExistente.setFechaCompra(compra.getFechaCompra());
        }
        if (compra.getEstado() != null) {
            compraExistente.setEstado(compra.getEstado());
        }
        if (compra.getTotalCompra() != null) {
            if (compra.getTotalCompra() < 0) {
                throw new RuntimeException("El total de la compra no puede ser negativo");
            }
            compraExistente.setTotalCompra(compra.getTotalCompra());
        }
        if (compra.getTipo() != null) {
            compraExistente.setTipo(compra.getTipo());
        }
        
        // Actualizar relaciones si se envían
        if (compra.getUsuario() != null && compra.getUsuario().getIdUsuario() != null) {
            UsuarioEntity usuario = usuarioRepository.findById(compra.getUsuario().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + compra.getUsuario().getIdUsuario()));
            compraExistente.setUsuario(usuario);
        }
        if (compra.getSucursal() != null && compra.getSucursal().getIdSucursal() != null) {
            SucursalEntity sucursal = sucursalRepository.findById(compra.getSucursal().getIdSucursal())
                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada con id: " + compra.getSucursal().getIdSucursal()));
            compraExistente.setSucursal(sucursal);
        }
        
        // Actualizar items si vienen en el request
        if (compra.getItems() != null) {
            compraExistente.getItems().clear();
            for (ItemEntity item : compra.getItems()) {
                item.setCompra(compraExistente);
                compraExistente.getItems().add(item);
            }
        }
        
        // Actualizar envios si vienen en el request
        if (compra.getEnvios() != null) {
            compraExistente.getEnvios().clear();
            for (EnvioEntity envio : compra.getEnvios()) {
                envio.setCompra(compraExistente);
                compraExistente.getEnvios().add(envio);
            }
        }
        
        // Actualizar pagos si vienen en el request
        if (compra.getPagos() != null) {
            compraExistente.getPagos().clear();
            for (PagoEntity pago : compra.getPagos()) {
                pago.setCompra(compraExistente);
                compraExistente.getPagos().add(pago);
            }
        }
        
        return compraRepository.save(compraExistente);
    }

    // Eliminar compra
    public void deleteCompra(Long id) {
        if (!compraRepository.existsById(id)) {
            throw new RuntimeException("Compra no encontrada con id: " + id);
        } if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        compraRepository.deleteById(id);
    }
}
