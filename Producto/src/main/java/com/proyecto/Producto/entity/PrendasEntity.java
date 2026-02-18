package com.proyecto.Producto.entity;

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

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id_categoria", nullable=false)
    private CategoriaEntity categoria; //“Esta prenda TIENE/PERTENECE UNA categoría”
                                       // usamos el objeto categoria entity porque ne Java modelamos objetos, no ids, eso se hace en terminos de BD
    
    // NO se modela OneToMany a ItemEntity porque ItemEntity está en otro microservicio (Compra)
    // Los items que referencian esta prenda se consultan desde el microservicio Compra usando el prendaId
}
