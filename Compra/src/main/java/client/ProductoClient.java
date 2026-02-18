package com.proyecto.Compra.client;  

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClientException;

import com.proyecto.Compra.dto.PrendaDTO;  



@Component //Aca Sprign crea u solo bean de esot, el cual despues de peude ineyctar en cualquier service
public class ProductoClient {
    
    private final RestClient restClient; //se instancia en el constructor del cliente con restclient.builder(), usando el productoServiceUrl que si se intecta con @Value
    
    //PASO 1: CONstructor - SE EJCUTA UNA SOLA VEZ AL INCIAR la app
    public ProductoClient(
        @Value("${producto.service.url}") String productoServiceUrl //value resuelve ${...} leyendo del environment, applicaiton-yml, etc, pongo esa clave en aplication.yml/properties y Spring inyecta ese valor en el constuctor
        ) {
    // @Value inyecta el valor desde application.yml
    // por ejemplo: "http://localhost:8081"
        this.restClient = RestClient.builder()
            .baseUrl(productoServiceUrl) // URL BASE del microservicio producto
            .defaultHeader("Content-Type", "application/json") // Cabecera por defecto, todas las request van a ser JSON, para no repetir en cada llamada  
            .build(); //construye el cliente, lo crea
    }

    //PASO 2: metodos para hacer peticiones HTTP
    //Metodo 1: obtener una prenda por ID, 
    //Hace: GET http://localhost:8081/api/prendas/{id}

    public PrendaDTO obtenerPrendaPorId(Long id) {
        try {
            return restClient.get() //tipo de peticion: GET
                .uri("/api/prendas/{id}", id) //endpoint completo, /api/prendas/1, fija ña rita relativa al baseUrl
                .retrieve() //ejecuta la peticion
                .body(PrendaDTO.class); //convierte la respuesta JSON a PrendaDTO
        } catch (RestClientException e) {
            throw new RuntimeException("Error al obtener prenda con id: " + id, e);
        }
        //lo q sucede internamente es, 
        //1, ahce el get a http://localhost:8082/api/prendas/1
        // recibe JSON, {"id":1, "nombre":"Camisa", "precio_Actual":50.0, ...}
        //lo ovnierte autmoaticamente a objeto PrendaDTO
        //retorna el objeto PrendaDTO
    }

    //Metodo 2 verificar is hay stokc (usando el metodo anterior)
    //ese metodo no pq tnego una entidad especifica de stock apra prenda xd

    //METODO 3 Obtener solo el precio de una prenda
    public Double obtenerPrecioPrenda(Long prendaId) {
        try {
         PrendaDTO prenda = obtenerPrendaPorId(prendaId); //aca es donde yas e hace el get(), uri(), retrieve(), body() yq ueda armado como PrendaDTO y no como JSON, es decir tenemos objeto JAVA ya hecho gracias al metodo este
        return prenda != null ? prenda.getPrecio_Actual() : 0.0;   
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener precio de prenda", e);
        }
    }

    //METODO 4: Obtener TODAS las prendas
    //hacemos GET http://localhost:8081/api/prendas

    public List<PrendaDTO> obtenerTodasLasPrendas() {
        try {
            return restClient.get()
                .uri("/api/prendas")
                .retrieve()
                .body(new ParameterizedTypeReference<List<PrendaDTO>>() {});
        } catch (RestClientException e) {
            throw new RuntimeException("Error al obtener lista de prendas", e);
        }
    }

    // Obtener productos por categoria (ej: "abrigos", "remeras", "shorts")
    public List<PrendaDTO> getProductosByCategoria(String categoria) {
        try {
            return restClient.get()
                .uri("/api/prendas/categoria/{cat}", categoria)
                .retrieve()
                .body(new ParameterizedTypeReference<List<PrendaDTO>>() {});
        } catch (RestClientException e) {
            throw new RuntimeException("Error al obtener productos por categoria: " + categoria, e);
        }
    }


}
