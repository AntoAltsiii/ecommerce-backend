package com.proyecto.Compra.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.Compra.dto.WeatherDTO;
import com.proyecto.Compra.dto.RecommendationDTO;
import com.proyecto.Compra.dto.UserLocationDTO;
import com.proyecto.Compra.service.WeatherService;
import com.proyecto.Compra.service.RecommendationService;

@RestController
@RequestMapping("/api/clima")

public class WeatherController {
    @Autowired
    private WeatherService weatherService;
    @Autowired
    private RecommendationService recommendationService;

    @PutMapping("/ubicacion/{userId}")
    public ResponseEntity<String> updateLocation(@PathVariable Long userId, @RequestBody UserLocationDTO location)
    {

        weatherService.updateUserLocation(userId, location);
        return ResponseEntity.ok("Ubicación actualizada correctamente");
    }

    @GetMapping("/usuario/{userId}")
    public ResponseEntity<WeatherDTO> getWeather(@PathVariable Long userId) {
        WeatherDTO weather = weatherService.getWeatherForUser(userId);
        return ResponseEntity.ok(weather);
    }

    @GetMapping("/recomendacion/{userId}")
    public ResponseEntity<RecommendationDTO> getRecommendarion(@PathVariable Long userId)
    {
        RecommendationDTO recommendation = recommendationService.getRecommendationForUser(userId);
        return ResponseEntity.ok(recommendation);
    }
}
