package com.proyecto.Compra.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Convierte un JWT validado en un Authentication de Spring Security
 * Extrae los roles de Keycloak (realm_access.roles) y los convierte a GrantedAuthority
 */
public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    
    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
        return new JwtAuthenticationToken(jwt, authorities);
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        // Extraer roles del claim "realm_access" de Keycloak
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        
        if (realmAccess == null || !realmAccess.containsKey("roles")) {
            return Collections.emptyList();
        }

        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) realmAccess.get("roles");
        
        // Convertir roles a GrantedAuthority con prefijo "ROLE_"
        return roles.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
            .collect(Collectors.toList());
    }
}
