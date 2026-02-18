package com.proyecto.Gateway.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

//si le jwt de la clase de seucirtyconfig es valido, entra aca, clase puente entre kaycloak y spring security
public class ReactiveJwtAuthenticationConverter implements Converter<Jwt, Mono<AbstractAuthenticationToken>> { //aca loq  pasa es q como ya tenemos el jwt validado, pedimos que se arme un ususairo de spring (autneticado tengo entendido)
    
    private static final Logger log = LoggerFactory.getLogger(ReactiveJwtAuthenticationConverter.class);
    
    @Override //esta clase convierte un jwt en un athentication reactivo
    public Mono<AbstractAuthenticationToken> convert(Jwt jwt) { // jwt token ya validado, mono<abstractauthenticationtoken> usuario authenticado reactivo
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt); //dice, anda al jwt y saca  los roles //este metodo lo llama spring cunaod necesita converitr jwt a un usuario
        
        // DEBUG: Mostrar usuario y roles extraídos
        String username = jwt.getClaimAsString("preferred_username");
        log.info("🔐 Usuario: {} | Roles extraídos: {}", username, authorities);
        
        return Mono.just(new JwtAuthenticationToken(jwt, authorities)); //esto crea el authentication, (principal, authorities, authenticated), etc
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) { //dice, anda al jwt y saca los roles
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access"); //metodo pribsfo auxilair que extrae los roles del token, ademas de aca puedes extraer otros claims personalizados que hayas puesto en el token
        if (realmAccess == null || !realmAccess.containsKey("roles")) {
            return Collections.emptyList(); //el usuario queda autenticado pero sin permisos
        }

        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) realmAccess.get("roles"); //aca converitmos el objeto generico a List<String>
        return roles.stream() //retorna finalmente un implegrantedauthority, ojbeto, dentro de un stream el cual termina formando una palabra del tipo ROLE_AFMIN o ROLE_ALGO, por lo de touppercase, y luego lo colecta en una lista de authorities
        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
        .collect(Collectors.toList());
    }
}
