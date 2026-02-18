package com.proyecto.Compra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos (mismo que Gateway)
                .requestMatchers("/api/sucursal", "/api/sucursal/**").permitAll()
                // El resto requiere autenticación
                .anyRequest().authenticated()
            )
            // Validar JWT como Resource Server
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(new JwtAuthenticationConverter()))
            );
        return http.build();
    }
}
