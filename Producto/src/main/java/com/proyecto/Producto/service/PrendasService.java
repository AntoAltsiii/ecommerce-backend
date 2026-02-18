package com.proyecto.Producto.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.Producto.entity.PrendasEntity;
import com.proyecto.Producto.repository.PrendasRepository;

@Service
public class PrendasService {
    
    @Autowired
    private PrendasRepository prendasRepository;

    public String crearPrenda(PrendasEntity prenda) {
        if (prenda.getPrecio_Actual() <= 0) {
            throw new RuntimeException("El precio de la prenda debe ser mayor a cero.");
        } if (prenda.getCategoria() == null) {
            throw new RuntimeException("La prenda debe pertenecer a una categoria.");
        }
        prendasRepository.save(prenda);
        return "Prenda agregada exitosamente.";
    }

    public String actualizarPrenda(Long id, PrendasEntity prenda) {
         if (prendasRepository.existsByNombreAndIdNot(prenda.getNombre(), id)) {
            throw new RuntimeException("La prenda con el nombre: " + prenda.getNombre() + "ya existe en el sistema.");
        }
        PrendasEntity prendaExistente = prendasRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Prenda no encontrada con dicho id"));

        prendaExistente.setNombre(prenda.getNombre());
        prendaExistente.setPrecio_Actual(prenda.getPrecio_Actual());
        prendasRepository.save(prendaExistente);
        return "Prenda aztualizada exitosamente.";

        //lo que ahcemos aca es traemos la prenda1 pasada por parametro, y luego buscamos
        //en ala BD dicha prenda, si existe entonces a esa rpenda obtenida orginalemnte
        //de la BD, le seteamos los valores nuevos de la NUEVA prenda, osea si yo paso la 
        //prenda "camisa", "30", "3", y la q encuentro en la BD es
        //prenda "camisa", "25", "5", entonces esa prenda se setea con los nuevos valores
    }

    public String eliminarPrenda(Long id) {
        if (!prendasRepository.existsById(id)){
            throw new RuntimeException("La prenda con el id: " + id + " no existe en el sistema.");
        }
        prendasRepository.deleteById(id);
        return "Prenda eliminada exitosamente.";}

    public List<PrendasEntity> obtenerTodasLasPrendas() {
        return prendasRepository.findAll();
    }

    public Optional<PrendasEntity> obtenerPrendaPorId(Long id) {
        return prendasRepository.findById(id);
    }

    public List<PrendasEntity> obtenerPrendasPorCategoria(String nombreCategoria) {
        return prendasRepository.findByCategoriaNombre(nombreCategoria);
    }
}
