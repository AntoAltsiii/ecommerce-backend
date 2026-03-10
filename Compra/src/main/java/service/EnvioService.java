package com.proyecto.Compra.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.Compra.entity.EnvioEntity;
import com.proyecto.Compra.repository.EnvioRepository;

@Service
public class EnvioService {

    @Autowired
    private EnvioRepository envioRepository;

public List<EnvioEntity> obtenerTodosLosEnvios() {
        return envioRepository.findAll();
    }

public Optional<EnvioEntity> getEnvioById(Long id) {
        return envioRepository.findById(id);
    }

public EnvioEntity createEnvio(EnvioEntity envio) {
        return envioRepository.save(envio);
    }

public EnvioEntity updateEnvio(Long id, EnvioEntity envio) {
        EnvioEntity envioExistente = envioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Envío no encontrado con id: " + id));

if (envio.getDireccionEnvio() != null) {
            envioExistente.setDireccionEnvio(envio.getDireccionEnvio());
        }
        if (envio.getTipoEnvio() != null) {
            envioExistente.setTipoEnvio(envio.getTipoEnvio());
        }
        if (envio.getCosto() != null) {
            if (envio.getCosto() < 0) {
                throw new RuntimeException("El costo del envío no puede ser negativo");
            }
            envioExistente.setCosto(envio.getCosto());
        }
        if (envio.getEstadoEnvio() != null) {
            envioExistente.setEstadoEnvio(envio.getEstadoEnvio());
        }
        if (envio.getFechaEnvio() != null) {
            envioExistente.setFechaEnvio(envio.getFechaEnvio());
        }

return envioRepository.save(envioExistente);
    }

public void deleteEnvio(Long id) {
        if (!envioRepository.existsById(id)) {
            throw new RuntimeException("Envio no encontrado con el id: " + id);
        } if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        envioRepository.deleteById(id);
    }
}
