package com.um.edu.uy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authz -> authz
                        .anyRequest().permitAll() // Permitir todas las solicitudes
                )
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Cambia esto según sea necesario
                .and()
                .csrf().disable(); // Deshabilitar CSRF solo si es necesario

        return http.build();
    }
}
