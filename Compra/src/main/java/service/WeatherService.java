
package com.proyecto.Compra.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.Compra.repository.UsuarioRepository;
import com.proyecto.Compra.entity.UsuarioEntity;
import com.proyecto.Compra.client.WeatherClient;
import com.proyecto.Compra.dto.WeatherDTO;

@Service
public class WeatherService {
    @Autowired
    private WeatherClient weatherClient;
    @Autowired
    private UsuarioRepository usuarioRepository;

    public WeatherDTO getWeatherForUser(Long userId) {
        //obtener por ID al usuario
        UsuarioEntity usuario = usuarioRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + userId));
        
        //obtener latitud y longitud del usuario
        Double latitude = usuario.getLatitude();
        Double longitude = usuario.getLongitude();
        
        // Validar que el usuario tenga ubicación configurada
        if (latitude == null || longitude == null) {
            throw new RuntimeException("El usuario no tiene ubicación configurada. " +
                "Por favor, actualiza tu ubicación usando PUT /api/clima/ubicacion/" + userId);
        }
        
        //llamar al cliente de clima con latitud y longitud
        WeatherDTO weather = weatherClient.getWeather(latitude, longitude);
        return weather;
    }

    public void updateUserLocation(Long userId, com.proyecto.Compra.dto.UserLocationDTO location) {
        UsuarioEntity usuario = usuarioRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + userId));

        usuario.setLatitude(location.getLatitude());
        usuario.setLongitude(location.getLongitude());

        usuarioRepository.save(usuario);
    }

}
