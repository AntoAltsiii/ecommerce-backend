package com.proyecto.Producto.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.proyecto.Producto.entity.CategoriaEntity;
import com.proyecto.Producto.service.CategoriaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoriaController.class)
@WithMockUser
public class CategoriaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CategoriaService categoriaService;

    @Test
    void testCrearCategoria_Exitoso() throws Exception {
        CategoriaEntity categoria = new CategoriaEntity();
        categoria.setNombreCategoria("Zapatos");

        String json = objectMapper.writeValueAsString(categoria);

        when(categoriaService.crearCategoria(any(CategoriaEntity.class)))
                .thenReturn("Categoria creada con exito!");

        mockMvc.perform(post("/categorias").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(json))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().string("Categoria creada con exito!"));
    }
}
