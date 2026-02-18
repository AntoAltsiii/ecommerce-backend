package com.proyecto.Compra.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
@Table(name="tb_pagos")
public class PagoEntity {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPago;

    @Column(nullable=false)
    private String metodoPago;

    @Column(nullable=false)
    private Double monto;

    @Column(nullable=false)
    @Enumerated(EnumType.STRING)
    private EstadoPago estadoPago;

    @Column(nullable=false)
    private String fechaPago;

    @JsonBackReference("compra-pagos")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_compra", nullable=false)
    private CompraEntity compra;
}
