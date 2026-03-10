package com.proyecto.Compra.client;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.proyecto.Compra.dto.WeatherDTO;

@Component

public class WeatherClient {
    private final WebClient webClient;

    public WeatherClient(WebClient.Builder builder) {
        this.webClient = builder
        .baseUrl("https://api.open-meteo.com")
        .build();
    }

    public WeatherDTO getWeather(Double lat, Double lon) {
        return webClient.get()
        .uri("/v1/forecast?latitude={lat}&longitude={lon}" +
                        "&current=temperature_2m,relative_humidity_2m,is_day" +
                        "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
                        "&timezone=auto",
                        lat, lon)
        .retrieve()
        .bodyToMono(WeatherDTO.class)
        .block();
    }
}
