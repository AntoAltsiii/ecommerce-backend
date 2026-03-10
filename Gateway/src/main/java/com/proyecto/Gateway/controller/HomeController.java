package com.proyecto.Gateway.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

@GetMapping("/home")
    public Mono<Map<String, Object>> home(
            @AuthenticationPrincipal OAuth2User principal,
            @RegisteredOAuth2AuthorizedClient("keycloak") OAuth2AuthorizedClient authorizedClient) {

        Map<String, Object> response = new HashMap<>();

response.put("mensaje", "✅ Login exitoso!");
        response.put("username", principal.getAttribute("preferred_username"));
        response.put("email", principal.getAttribute("email"));
        response.put("nombre", principal.getAttribute("name"));
        response.put("roles", principal.getAttribute("realm_access"));

response.put("access_token", authorizedClient.getAccessToken().getTokenValue());
        response.put("token_type", "Bearer");
        response.put("expira_en", authorizedClient.getAccessToken().getExpiresAt());

if (authorizedClient.getRefreshToken() != null) {
            response.put("refresh_token", authorizedClient.getRefreshToken().getTokenValue());
        }

response.put("instrucciones", "Copia el 'access_token' y úsalo en Postman con: Authorization: Bearer <token>");

        return Mono.just(response);
    }

@GetMapping("/")
    public Mono<String> index() {
        return Mono.just("""
            🚀 Gateway API - OAuth2 con Keycloak

            📌 Para obtener tu token:
            1. Ve a: http://localhost:8090/oauth2/authorization/keycloak
            2. Inicia sesión en Keycloak
            3. Serás redirigido a /home con tu token
            4. Copia el 'access_token' del JSON
            5. Úsalo en Postman: Authorization → Bearer Token

            ✅ Endpoints disponibles: /api/compras, /api/prendas, etc.
            """);
    }

@GetMapping("/me")
    public Mono<Map<String, Object>> me(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return Mono.just(Map.of("autenticado", false, "mensaje", "No hay sesión activa"));
        }

        return Mono.just(Map.of(
            "autenticado", true,
            "usuario", principal.getAttribute("preferred_username"),
            "email", principal.getAttribute("email")
        ));
    }
}
