package com.proyecto.Compra.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="tb_usuarios")
public class UsuarioEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable=false, unique=true)
    private Long idUsuario;
    
    private String nombre;
    
    private String apellido;
    
    @Column(nullable=false, unique=true)
    private String email;

    @Column(nullable=false)
    private String direccion;

    @Column(nullable=true)  // Nullable porque no todos los usuarios tienen ubicación inicialmente
    private Double latitude;
    
    @Column(nullable=true)  // Nullable porque no todos los usuarios tienen ubicación inicialmente
    private Double longitude; //en private, para obtener ubicacion de cada usuario de forma privada

    @JsonIgnore
    @JsonManagedReference("usuario-compras")
    @OneToMany(
        mappedBy = "usuario",
        fetch = FetchType.LAZY, 
        cascade = CascadeType.ALL
    )
    private List<CompraEntity> compras; //un usuario TIENE MUCHAS comrpas
}
