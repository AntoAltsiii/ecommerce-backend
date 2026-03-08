package com.proyecto.Compra.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_compras")
public class CompraEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCompra;
    
    @Column(nullable=false)
    private String fechaCompra;
    
    @Column(nullable=false)
    @Enumerated(EnumType.STRING)
    private EstadoCompra estado;
    
    @Column(nullable=false)
    private Double totalCompra;
    
    @Column(nullable=false)
    private String tipo;

    // @JsonIgnoreProperties evita el loop: muestra usuario pero NO su lista de compras
    @JsonIgnoreProperties({"compras"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="id_Usuario", nullable=false)
    private UsuarioEntity usuario;

    @JsonIgnoreProperties({"compras"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="id_sucursal", nullable=false)
    private SucursalEntity sucursal;

    @JsonManagedReference("compra-envios")
    @OneToMany(
        mappedBy = "compra",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL
    )
    private List<EnvioEntity> envios;

    @JsonManagedReference("compra-pagos")
    @OneToMany(
        mappedBy="compra",
        fetch = FetchType.LAZY, 
        cascade = CascadeType.ALL
    )
    private List<PagoEntity> pagos;

    @JsonManagedReference("compra-items")
    @OneToMany(
        mappedBy="compra",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL
    )
    private List<ItemEntity> items;

}
