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

    WeatherDTO weather = weatherService.getWeatherForUser(userId);

    Double temp = weather.getCurrent().getTemperature2m();
    Integer humedad = weather.getCurrent().getRelativeHumidity2m();
    Boolean esDia = weather.getCurrent().getIsDay() == 1;

    List<PrendaDTO> prendas;
    String mensaje;
    List<String> tiposRecomendados = new ArrayList<>();
    String condicion;

    if (temp < 15) {

        prendas = obtenerPrendasPorTemperatura("frio");
        mensaje = "Hace frío. Te recomendamos ropa abrigada 🧥";
        tiposRecomendados.add("abrigo");
        tiposRecomendados.add("pantalon_largo");
        tiposRecomendados.add("bufanda");
        condicion = "Frío";
    }
    else if (temp <= 25) {

        prendas = obtenerPrendasPorTemperatura("templado");
        mensaje = "Clima templado. Algo liviano está bien 👕";
        tiposRecomendados.add("remera");
        tiposRecomendados.add("jean");
        condicion = "Templado";
    }
    else {

        prendas = obtenerPrendasPorTemperatura("calor");
        mensaje = "Hace calor. Usá ropa fresca ☀️";
        tiposRecomendados.add("short");
        tiposRecomendados.add("remera_liviana");
        tiposRecomendados.add("sandalias");
        condicion = "Calor";
    }

List<RecommendationDTO.PrendaRecomendada> prendasRecomendadas = prendas.stream()
        .limit(5)
        .map(p -> RecommendationDTO.PrendaRecomendada.builder()
            .idPrenda(p.getId())
            .nombre(p.getNombre())
            .precio(p.getPrecio_Actual())
            .tipo(determinarTipo(temp))
            .razon("Ideal para clima " + condicion.toLowerCase())
            .build())
        .toList();

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

    String[] categoriasPosibles;

    if (tipo.equals("frio")) {
        categoriasPosibles = new String[]{
            "abrigos", "abrigo", "camperas", "campera", "buzos", "buzo",
            "medias", "media", "guantes", "guante", "bufandas", "bufanda",
            "botas", "bota", "pantalones largos", "pantalon largo", "pantalones", "pantalon",
            "mangas largas", "manga larga", "gorros", "gorro"
        };
    } else if (tipo.equals("templado")) {
        categoriasPosibles = new String[]{
            "remeras livianas", "remera liviana", "remeras", "remera",
            "camisas", "camisa", "livianas", "liviana",
            "poleras", "polera"
        };
    } else {
        categoriasPosibles = new String[]{
            "musculosas", "musculosa", "chulas", "chula",
            "polleras", "pollera", "shorts", "short",
            "shorts de jean", "short de jean", "bermudas", "bermuda",
            "tops", "top", "bikinis", "bikini"
        };
    }

for (String categoria : categoriasPosibles) {
        try {
            List<PrendaDTO> prendas = productoClient.getProductosByCategoria(categoria);
            if (prendas != null && !prendas.isEmpty()) {
                return prendas;
            }
        } catch (Exception e) {

            continue;
        }
    }

return new ArrayList<>();
}

private String determinarTipo(Double temp) {
    if (temp < 15) return "frio";
    else if (temp <= 25) return "templado";
    else return "calor";
}

private String obtenerCondicionPorCodigo(Integer codigo) {

    if (codigo == 0) return "Despejado";
    if (codigo <= 3) return "Parcialmente nublado";
    if (codigo <= 48) return "Niebla";
    if (codigo <= 67) return "Lluvia";
    if (codigo <= 77) return "Nieve";
    if (codigo <= 99) return "Tormenta";
    return "Desconocido";
}
}
