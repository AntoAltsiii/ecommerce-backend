package com.proyecto.Compra.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name="tb_items")
public class ItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable=false, unique=true)
    private Long idItem;

    @Column(nullable=false)
    private int cantidad;

    @Column(nullable=false)
    private Double precioUnitario;

    @Column(nullable=false)
    private Double subtotal;

    @Column(name="id_prenda", nullable=false)
    private Long prendaId;

    @JsonBackReference("compra-items")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_compra", nullable=false)
    private CompraEntity compra;
}
