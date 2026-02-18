package com.proyecto.Compra.entity;

import java.lang.annotation.Inherited;

import com.fasterxml.jackson.annotation.JsonBackReference;

import com.proyecto.Compra.entity.CompraEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="tb_envios")
public class EnvioEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable=false, unique=true)
    private Long idEnvio;

    @Column(nullable=false)
    private String direccionEnvio;

    @Column(nullable=false)
    private String tipoEnvio;

    @Column(nullable=false)
    private Double costo;

    @Column(nullable=false)
    @Enumerated(EnumType.STRING)
    private EstadoEnvio estadoEnvio;

    @Column(nullable=false)
    private String fechaEnvio;
    //fk id compra manytoone
    @JsonBackReference("compra-envios")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_compra", nullable=false)
    private CompraEntity compra; //este envio pertenece a UNA COMPRA
}
