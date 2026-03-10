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
@EnableWebFluxSecurity
public class SecurityConfig {
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeExchange(auth -> auth

.pathMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

.pathMatchers("/", "/login**", "/oauth2/**", "/error", "/home").permitAll()

.pathMatchers(org.springframework.http.HttpMethod.GET, "/api/prendas", "/api/prendas/**").permitAll()
                .pathMatchers(org.springframework.http.HttpMethod.GET, "/api/categorias", "/api/categorias/**").permitAll()
                .pathMatchers(org.springframework.http.HttpMethod.POST, "/api/prendas/**").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.PUT, "/api/prendas/**").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.DELETE, "/api/prendas/**").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.POST, "/api/categorias/**").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.PUT, "/api/categorias/**").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMIN")

.pathMatchers(org.springframework.http.HttpMethod.GET, "/api/sucursal", "/api/sucursal/**").permitAll()
                .pathMatchers("/api/sucursal/**").hasRole("ADMIN")

.pathMatchers(org.springframework.http.HttpMethod.GET, "/api/usuarios").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.GET, "/api/usuarios/email/**").hasAnyRole("CLIENTE", "ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.GET, "/api/usuarios/**").hasRole("ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.POST, "/api/usuarios", "/api/usuarios/**").hasAnyRole("CLIENTE", "ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.PUT, "/api/usuarios/**").hasAnyRole("CLIENTE", "ADMIN")
                .pathMatchers(org.springframework.http.HttpMethod.DELETE, "/api/usuarios/**").hasRole("ADMIN")

.pathMatchers(org.springframework.http.HttpMethod.GET, "/api/stock", "/api/stock/**").authenticated()
                .pathMatchers("/api/stock", "/api/stock/**").hasRole("ADMIN")

                .pathMatchers("/api/compras", "/api/compras/**").hasAnyRole("CLIENTE", "ADMIN")
                .pathMatchers("/api/item", "/api/item/**").hasAnyRole("CLIENTE", "ADMIN")
                .pathMatchers("/api/pago", "/api/pago/**").hasAnyRole("CLIENTE", "ADMIN")
                .pathMatchers("/api/clima", "/api/clima/**").hasAnyRole("CLIENTE", "ADMIN")

                .pathMatchers("/api/envio", "/api/envio/**").hasAnyRole("CLIENTE", "REPARTIDOR", "ADMIN")

                .anyExchange().authenticated()
            )

            .oauth2Login(oauth2 -> oauth2
                .authenticationSuccessHandler(
                    (webFilterExchange, authentication) -> {
                        webFilterExchange.getExchange().getResponse().setStatusCode(org.springframework.http.HttpStatus.FOUND);
                        webFilterExchange.getExchange().getResponse().getHeaders().setLocation(java.net.URI.create("/home"));
                        return reactor.core.publisher.Mono.empty();
                    }
                )
            )

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
