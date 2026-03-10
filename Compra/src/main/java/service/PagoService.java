package com.proyecto.Compra.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.Compra.entity.PagoEntity;
import com.proyecto.Compra.repository.PagoRepository;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

public List<PagoEntity> obtenerTodosLosPagos() {
        return pagoRepository.findAll();
    }

public Optional<PagoEntity> getPagoById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        return pagoRepository.findById(id);
    }

public PagoEntity createPago(PagoEntity pago) {
        return pagoRepository.save(pago);
    }

public PagoEntity updatePago(Long id, PagoEntity pago) {
        PagoEntity pagoExistente = pagoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pago no encontrado con id: " + id));

if (pago.getMetodoPago() != null) {
            pagoExistente.setMetodoPago(pago.getMetodoPago());
        }
        if (pago.getMonto() != null) {
            if (pago.getMonto() <= 0) {
                throw new RuntimeException("El monto del pago debe ser mayor a cero");
            }
            pagoExistente.setMonto(pago.getMonto());
        }
        if (pago.getEstadoPago() != null) {
            pagoExistente.setEstadoPago(pago.getEstadoPago());
        }
        if (pago.getFechaPago() != null) {
            pagoExistente.setFechaPago(pago.getFechaPago());
        }

return pagoRepository.save(pagoExistente);
    }

public void deletePago(Long id) {
        if (!pagoRepository.existsById(id)) {
            throw new RuntimeException("Pago no encontrado con id: " + id);
        } if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        pagoRepository.deleteById(id);
    }
}
