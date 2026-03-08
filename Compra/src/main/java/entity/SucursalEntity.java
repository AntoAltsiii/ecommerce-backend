package com.proyecto.Compra.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name="tb_sucursales")
public class SucursalEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sucursal_seq")
    @jakarta.persistence.SequenceGenerator(name = "sucursal_seq", sequenceName = "tb_sucursales_id_sucursal_seq", allocationSize = 1)
    @Column(name="id_sucursal", nullable=false, unique=true)
    private Long idSucursal;
    
    @Column(nullable=false)
    private String nombreSucursal;
    
    @Column(nullable=false)
    private String direccionSucursal;
    
    @Column(nullable=false)
    private String telefonoSucursal;

    @JsonIgnore
    @OneToMany(
        mappedBy = "sucursal",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL
    )
    private List<CompraEntity> compras;
}
