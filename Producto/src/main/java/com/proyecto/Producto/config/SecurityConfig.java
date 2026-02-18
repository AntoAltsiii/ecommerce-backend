package com.proyecto.Producto.config;

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
                // Catálogo - LECTURA pública, ESCRITURA requiere ADMIN
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/prendas", "/api/prendas/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/categorias", "/api/categorias/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/prendas/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/prendas/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/prendas/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMIN")
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
