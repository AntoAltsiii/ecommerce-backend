package com.proyecto.Compra.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.proyecto.Compra.entity.SucursalEntity;

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
	@Table(name="tb_stock")
	public class StockEntity {
		
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private Long idStock;

		@Column(nullable=false)
		private int cantidad;

		//fk prenda

		@JsonBackReference
		@ManyToOne(fetch = FetchType.LAZY)
		@JoinColumn(name="id_sucursal", nullable=false)
		private SucursalEntity sucursal; //este stock pertenece a UNA sucursal
	}
