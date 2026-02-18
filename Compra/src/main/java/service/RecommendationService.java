
package com.proyecto.Compra.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.Compra.client.ProductoClient;
import com.proyecto.Compra.dto.PrendaDTO;
import com.proyecto.Compra.dto.RecommendationDTO;
import com.proyecto.Compra.dto.WeatherDTO;

@Service
public class RecommendationService {
    @Autowired
    private WeatherService weatherService;
    @Autowired
    private ProductoClient productoClient;

    public RecommendationDTO getRecommendationForUser(Long userId) {
    //obtenemos clima dle usuario via weatherService
    WeatherDTO weather = weatherService.getWeatherForUser(userId);

    Double temp = weather.getCurrent().getTemperature2m();
    Integer humedad = weather.getCurrent().getRelativeHumidity2m();
    Boolean esDia = weather.getCurrent().getIsDay() == 1;

    List<PrendaDTO> prendas;
    String mensaje;
    List<String> tiposRecomendados = new ArrayList<>();
    String condicion;

    if (temp < 15) {
        // Intentar obtener prendas de abrigo (prueba múltiples nombres)
        prendas = obtenerPrendasPorTemperatura("frio");
        mensaje = "Hace frío. Te recomendamos ropa abrigada 🧥";
        tiposRecomendados.add("abrigo");
        tiposRecomendados.add("pantalon_largo");
        tiposRecomendados.add("bufanda");
        condicion = "Frío";
    }
    else if (temp <= 25) {
        // Intentar obtener prendas livianas
        prendas = obtenerPrendasPorTemperatura("templado");
        mensaje = "Clima templado. Algo liviano está bien 👕";
        tiposRecomendados.add("remera");
        tiposRecomendados.add("jean");
        condicion = "Templado";
    }
    else {
        // Intentar obtener prendas de verano
        prendas = obtenerPrendasPorTemperatura("calor");
        mensaje = "Hace calor. Usá ropa fresca ☀️";
        tiposRecomendados.add("short");
        tiposRecomendados.add("remera_liviana");
        tiposRecomendados.add("sandalias");
        condicion = "Calor";
    }

    // Convertir prendas a PrendaRecomendada (opcional, solo si quieres incluirlas)
    List<RecommendationDTO.PrendaRecomendada> prendasRecomendadas = prendas.stream()
        .limit(5)  // Limitar a 5 prendas
        .map(p -> RecommendationDTO.PrendaRecomendada.builder()
            .idPrenda(p.getId())
            .nombre(p.getNombre())
            .precio(p.getPrecio_Actual())
            .tipo(determinarTipo(temp))
            .razon("Ideal para clima " + condicion.toLowerCase())
            .build())
        .toList();

    // Construir pronóstico del día actual
    RecommendationDTO.PronosticoDia pronostico = null;
    if (weather.getDaily() != null && !weather.getDaily().getTime().isEmpty()) {
        pronostico = RecommendationDTO.PronosticoDia.builder()
            .fecha(weather.getDaily().getTime().get(0))
            .tempMaxima(weather.getDaily().getTemperature2mMax().get(0))
            .tempMinima(weather.getDaily().getTemperature2mMin().get(0))
            .condicionEsperada(obtenerCondicionPorCodigo(weather.getDaily().getWeatherCode().get(0)))
            .build();
    }

    return RecommendationDTO.builder()
            .mensaje(mensaje)
            .temperaturaActual(temp)
            .humedad(humedad)
            .condicion(condicion)
            .esDeDia(esDia)
            .tiposRecomendados(tiposRecomendados)
            .prendas(prendasRecomendadas)
            .pronostico(pronostico)
            .build();
}

private List<PrendaDTO> obtenerPrendasPorTemperatura(String tipo) {
    // Intenta buscar prendas por diferentes categorías según el clima
    String[] categoriasPosibles;
    
    if (tipo.equals("frio")) {
        categoriasPosibles = new String[]{"abrigos", "abrigo", "camperas", "campera", "buzos", "buzo"};
    } else if (tipo.equals("templado")) {
        categoriasPosibles = new String[]{"remeras", "remera", "camisas", "camisa", "poleras", "polera"};
    } else {
        categoriasPosibles = new String[]{"shorts", "short", "bermudas", "bermuda", "musculosas", "musculosa"};
    }
    
    // Intenta buscar con cada categoría posible
    for (String categoria : categoriasPosibles) {
        try {
            List<PrendaDTO> prendas = productoClient.getProductosByCategoria(categoria);
            if (prendas != null && !prendas.isEmpty()) {
                return prendas; // Retorna la primera que tenga resultados
            }
        } catch (Exception e) {
            // Si falla, intenta con la siguiente categoría
            continue;
        }
    }
    
    // Si no encuentra ninguna, retorna lista vacía
    return new ArrayList<>();
}

private String determinarTipo(Double temp) {
    if (temp < 15) return "abrigo";
    else if (temp <= 25) return "remera";
    else return "short";
}

private String obtenerCondicionPorCodigo(Integer codigo) {
    // Códigos WMO Weather interpretation
    if (codigo == 0) return "Despejado";
    if (codigo <= 3) return "Parcialmente nublado";
    if (codigo <= 48) return "Niebla";
    if (codigo <= 67) return "Lluvia";
    if (codigo <= 77) return "Nieve";
    if (codigo <= 99) return "Tormenta";
    return "Desconocido";
}
}
