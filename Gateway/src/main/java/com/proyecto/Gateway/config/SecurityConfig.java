package com.proyecto.Gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity //esta linea dice intercepta todas las reuqest HTTP y aplcia seguridad web reactiva 
public class SecurityConfig {
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeExchange(auth -> auth
                // Endpoints públicos (sin autenticación)
                .pathMatchers("/", "/login**", "/oauth2/**", "/error", "/home").permitAll()
                
                // Catálogo de productos - LECTURA pública, ESCRITURA solo ADMIN
                .pathMatchers(org.springframework.http.HttpMethod.GET, "/api/prendas", "/api/prendas/**").permitAll()
                .pathMatchers(org.springframework.http.HttpMethod.GET, "/api/categorias", "/api/categorias/**").permitAll()
                .pathMatchers(org.springframework.http.HttpMethod.POST, "/api/prendas/**").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.PUT, "/api/prendas/**").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.DELETE, "/api/prendas/**").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.POST, "/api/categorias/**").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.PUT, "/api/categorias/**").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMIN")
                
                // Sucursales - lectura pública
                .pathMatchers(org.springframework.http.HttpMethod.GET, "/api/sucursal", "/api/sucursal/**").permitAll()
                .pathMatchers("/api/sucursal/**").hasRole("ADMIN")  // Escritura solo ADMIN

                // Endpoints con roles - IMPORTANTE: incluir path base Y con /**
                .pathMatchers("/api/usuarios", "/api/usuarios/**").hasRole("ADMIN")
                .pathMatchers("/api/stock", "/api/stock/**").hasRole("ADMIN")

                .pathMatchers("/api/compras", "/api/compras/**").hasAnyRole("CLIENTE", "ADMIN")
                .pathMatchers("/api/item", "/api/item/**").hasAnyRole("CLIENTE", "ADMIN")
                .pathMatchers("/api/pago", "/api/pago/**").hasAnyRole("CLIENTE", "ADMIN")
                .pathMatchers("/api/clima", "/api/clima/**").hasAnyRole("CLIENTE", "ADMIN")

                .pathMatchers("/api/envio", "/api/envio/**").hasAnyRole("CLIENTE", "REPARTIDOR", "ADMIN")

                .anyExchange().authenticated()
            )
            // OAuth2 Login (Authorization Code + PKCE)
            .oauth2Login(oauth2 -> oauth2
                .authenticationSuccessHandler(
                    (webFilterExchange, authentication) -> {
                        webFilterExchange.getExchange().getResponse().setStatusCode(org.springframework.http.HttpStatus.FOUND);
                        webFilterExchange.getExchange().getResponse().getHeaders().setLocation(java.net.URI.create("/home"));
                        return reactor.core.publisher.Mono.empty();
                    }
                )
            )
            // OAuth2 Resource Server (validar JWT)
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );
        return http.build();
    }

    @Bean
    public Converter<Jwt, Mono<AbstractAuthenticationToken>> jwtAuthenticationConverter() {
        return new ReactiveJwtAuthenticationConverter();
    }
}
