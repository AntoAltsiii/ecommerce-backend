package com.proyecto.Producto.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

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
@Table(name = "tb_prendas")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class PrendasEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable= false, unique=true)
    private String nombre;

    @Column(nullable=false)
    private Double precio_Actual;

@Column(nullable=true)
    private String imagenUrl;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="id_categoria", nullable=false)
    private CategoriaEntity categoria;

@JsonProperty("categoriaId")
    public Long getCategoriaId() {
        return categoria != null ? categoria.getIdCategoria() : null;
    }

@JsonProperty("categoriaNombre")
    public String getCategoriaNombre() {
        return categoria != null ? categoria.getNombreCategoria() : null;
    }

}
