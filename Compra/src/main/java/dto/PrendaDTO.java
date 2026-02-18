package com.proyecto.Compra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrendaDTO {
    private Long id;
    private String nombre;
    private Double precio_Actual;
    private Long categoriaId;
}
