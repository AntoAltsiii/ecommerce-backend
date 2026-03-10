package com.proyecto.Compra.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class RecommendationDTO {
    private String mensaje;

    private Double temperaturaActual;

    private Integer humedad;

    private String condicion;

    private Boolean esDeDia;

    private List<String> tiposRecomendados;

    private List<PrendaRecomendada> prendas;

    private PronosticoDia pronostico;

@Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PrendaRecomendada {
        private Long idPrenda;
        private String nombre;
        private String tipo;
        private String categoria;
        private Double precio;
        private String urlImagen;
        private String razon;
    }

@Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PronosticoDia {
        private String fecha;
        private Double tempMaxima;
        private Double tempMinima;
        private String condicionEsperada;
    }
}
