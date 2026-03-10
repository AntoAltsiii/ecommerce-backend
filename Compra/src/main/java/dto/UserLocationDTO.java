package com.proyecto.Compra.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserLocationDTO {
     @NotNull(message = "La latitud es obligatoria")
    @Min(value = -90, message = "La latitud debe estar entre -90 y 90")
    @Max(value = 90, message = "La latitud debe estar entre -90 y 90")
    private Double latitude;

    @NotNull(message = "La longitud es obligatoria")
    @Min(value = -180, message = "La longitud debe estar entre -180 y 180")
    @Max(value = 180, message = "La longitud debe estar entre -180 y 180")
    private Double longitude;

private String ciudad;

    private String pais;

    private String descripcion;

}
