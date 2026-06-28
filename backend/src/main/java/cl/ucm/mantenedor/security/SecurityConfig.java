package cl.ucm.mantenedor.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@EnableWebSecurity
@Configuration
public class SecurityConfig {
    @Autowired
    private CorsConfigurationSource corsConfigurationSource;
    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(config -> config.configurationSource(corsConfigurationSource))//.cors(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/auth/veterinarios").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/auth/recepcionistas").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.GET, "/auth/usuarios/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.PUT, "/auth/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/auth/usuarios/**").hasRole("ADMIN")
                        .requestMatchers("/auth/create").hasRole("ADMIN")
                        .requestMatchers("/tratamiento", "/tratamiento/**").hasRole("ADMIN")
                        .requestMatchers("/cita", "/cita/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/mascota", "/mascota/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/duenio", "/duenio/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/historialmedico", "/historialmedico/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/dashboard", "/dashboard/**").hasAnyRole("ADMIN", "USER")
                        .anyRequest()
                        .authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
