package com.proyecto.Compra.client;

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClientException;

import com.proyecto.Compra.dto.PrendaDTO;

@Component
public class ProductoClient {

    private final RestClient restClient;

public ProductoClient(
        @Value("${producto.service.url}") String productoServiceUrl
        ) {

this.restClient = RestClient.builder()
            .baseUrl(productoServiceUrl)
            .defaultHeader("Content-Type", "application/json")
            .build();
    }

public PrendaDTO obtenerPrendaPorId(Long id) {
        try {
            return restClient.get()
                .uri("/api/prendas/{id}", id)
                .retrieve()
                .body(PrendaDTO.class);
        } catch (RestClientException e) {
            throw new RuntimeException("Error al obtener prenda con id: " + id, e);
        }

}

public Double obtenerPrecioPrenda(Long prendaId) {
        try {
         PrendaDTO prenda = obtenerPrendaPorId(prendaId);
        return prenda != null ? prenda.getPrecio_Actual() : 0.0;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener precio de prenda", e);
        }
    }

public List<PrendaDTO> obtenerTodasLasPrendas() {
        try {
            return restClient.get()
                .uri("/api/prendas")
                .retrieve()
                .body(new ParameterizedTypeReference<List<PrendaDTO>>() {});
        } catch (RestClientException e) {
            throw new RuntimeException("Error al obtener lista de prendas", e);
        }
    }

public List<PrendaDTO> getProductosByCategoria(String categoria) {
        try {
            return restClient.get()
                .uri("/api/prendas/categoria/{cat}", categoria)
                .retrieve()
                .body(new ParameterizedTypeReference<List<PrendaDTO>>() {});
        } catch (RestClientException e) {
            throw new RuntimeException("Error al obtener productos por categoria: " + categoria, e);
        }
    }

}
