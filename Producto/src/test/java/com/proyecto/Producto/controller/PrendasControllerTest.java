package com.proyecto.Producto.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.proyecto.Producto.entity.CategoriaEntity;
import com.proyecto.Producto.entity.PrendasEntity;
import com.proyecto.Producto.service.PrendasService;
import com.proyecto.Producto.repository.CategoriaRepository;
import com.proyecto.Producto.repository.PrendasRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

/**
 * Test de Integración para PrendasController
 * 
 * Estos tests prueban los endpoints REST del controlador de prendas
 * usando MockMvc para simular peticiones HTTP sin levantar un servidor real.
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@WithMockUser // Desactiva la seguridad para los tests
class PrendasControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper; // Para convertir objetos a JSON

    private PrendasEntity prendaEjemplo;
    private CategoriaEntity categoriaEjemplo;
    @Autowired
    private PrendasRepository prendasRepository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    private Long idExistente;

    @BeforeEach
    void setUp() {
        // Limpiar y persistir datos reales en la BD de prueba
        prendasRepository.deleteAll();
        categoriaRepository.deleteAll();

        categoriaEjemplo = new CategoriaEntity();
        categoriaEjemplo.setNombreCategoria("Zapatos");
        categoriaEjemplo = categoriaRepository.save(categoriaEjemplo);

        prendaEjemplo = new PrendasEntity();
        prendaEjemplo.setNombre("Remera Básica5");
        prendaEjemplo.setPrecio_Actual(2501.0);
        prendaEjemplo.setCategoria(categoriaEjemplo);
        prendaEjemplo = prendasRepository.save(prendaEjemplo);

        idExistente = prendaEjemplo.getId();
    }

    /**
     * Test: Crear una prenda exitosamente
     * 
     * GIVEN: Una prenda válida con nombre, precio y categoría
     * WHEN: Se hace POST a /prendas con los datos de la prenda
     * THEN: Responde con 201 CREATED y un mensaje de éxito
     */
    @Test
    void testCrearPrenda_Exitoso() throws Exception {
        // Crear JSON manualmente para incluir la categoría (evita problema con @JsonBackReference)
        String prendaJson = String.format(
            "{\"nombre\":\"Remera Crear Test\",\"precio_Actual\":1000.0,\"categoria\":{\"idCategoria\":%d}}",
            categoriaEjemplo.getIdCategoria()
        );

        mockMvc.perform(post("/prendas")
            .contentType(MediaType.APPLICATION_JSON)
            .content(prendaJson))
                .andDo(print()) // Imprime la petición y respuesta en consola
                .andExpect(status().isCreated()) // Esperamos HTTP 201
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Prenda agregada exitosamente.")));
    }

    /**
     * Test: Crear una prenda con precio negativo
     * 
     * GIVEN: Una prenda con precio negativo
     * WHEN: Se hace POST a /prendas
     * THEN: Debería fallar (puedes agregar validación en la entidad)
     */
    @Test
    void testCrearPrenda_PrecioNegativo() throws Exception {
        // Crear JSON manualmente para incluir la categoría (evita problema con @JsonBackReference)
        String prendaJson = String.format(
            "{\"nombre\":\"PrendaNegTest\",\"precio_Actual\":-100.0,\"categoria\":{\"idCategoria\":%d}}",
            categoriaEjemplo.getIdCategoria()
        );

        mockMvc.perform(post("/prendas")
            .contentType(MediaType.APPLICATION_JSON)
            .content(prendaJson))
                .andDo(print())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("El precio de la prenda debe ser mayor a cero.")));
    }

    /**
     * Test: Obtener todas las prendas
     * 
     * GIVEN: Existen prendas en el sistema
     * WHEN: Se hace GET a /prendas
     * THEN: Responde con HTTP 200 y una lista de prendas en formato JSON
     */
    @Test
    void testObtenerTodasLasPrendas() throws Exception {
        mockMvc.perform(get("/prendas")
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    /**
     * Test: Obtener una prenda por ID que existe
     * 
     * GIVEN: Existe una prenda con ID = 1
     * WHEN: Se hace GET a /prendas/1
     * THEN: Responde con HTTP 200 y los datos de la prenda
     */
    @Test
    void testObtenerPrendaPorId_Existente() throws Exception {

        mockMvc.perform(get("/prendas/{id}", idExistente)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());
    }

    /**
     * Test: Obtener una prenda por ID que NO existe
     * 
     * GIVEN: No existe una prenda con ID = 9999
     * WHEN: Se hace GET a /prendas/9999
     * THEN: Responde con HTTP 404 NOT FOUND
     */
    @Test
    void testObtenerPrendaPorId_NoExistente() throws Exception {
        Long idInexistente = 9999L;

        mockMvc.perform(get("/prendas/{id}", idInexistente)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    /**
     * Test: Actualizar una prenda existente
     * 
     * GIVEN: Existe una prenda y queremos modificar su precio
     * WHEN: Se hace PUT a /prendas/{id} con los nuevos datos
     * THEN: Responde con HTTP 200 y un mensaje de éxito
     */
    @Test
    void testActualizarPrenda_Exitoso() throws Exception {
        prendaEjemplo.setPrecio_Actual(3250.0); // Nuevo precio
        String prendaJson = objectMapper.writeValueAsString(prendaEjemplo);

        mockMvc.perform(put("/prendas/{id}", idExistente)
            .contentType(MediaType.APPLICATION_JSON)
            .content(prendaJson))
                .andDo(print())
                .andExpect(status().isOk());
    }

    /**
     * Test: Eliminar una prenda existente
     * 
     * GIVEN: Existe una prenda con ID = 1
     * WHEN: Se hace DELETE a /prendas/1
     * THEN: Responde con HTTP 200 y un mensaje de éxito
     */
    @Test
    void testEliminarPrenda_Exitoso() throws Exception {
        mockMvc.perform(delete("/prendas/{id}", idExistente))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("exitosamente")));
    }

    /**
     * Test: Eliminar una prenda que NO existe
     * 
     * GIVEN: No existe una prenda con ID = 9999
     * WHEN: Se hace DELETE a /prendas/9999
     * THEN: Debería lanzar excepción (puedes manejarla con @ControllerAdvice)
     */
    @Test
    void testEliminarPrenda_NoExistente() throws Exception {
        Long idInexistente = 9999L;

        mockMvc.perform(delete("/prendas/{id}", idInexistente))
                .andDo(print())
                .andExpect(status().isNotFound())
            .andExpect(content().string(
                "La prenda con el id: 9999 no existe en el sistema."
            ));
}}