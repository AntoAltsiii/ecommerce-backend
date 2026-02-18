
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

    private List<String> tiposRecomendados;// Ej: ["abrigo", "pantalon_largo", "bufanda"]

    private List<PrendaRecomendada> prendas; // OPCIONAL: Lista de prendas específicas del catálogo

    private PronosticoDia pronostico;  // Información de pronóstico (opcional)


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
        private String razon; // Explicación de por qué se recomienda esta prenda, ejemplo "dieal para clima frio"
    }

    //Clase itnerna para pronositoc resumido
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PronosticoDia {
        private String fecha; // Ej: "2024-06-15"
        private Double tempMaxima;
        private Double tempMinima;
        private String condicionEsperada; // Ej: "soleado", "lluvioso", etc.
    }
}
