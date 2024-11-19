package com.ottogi.be.auth.config;

import com.ottogi.be.auth.filter.AuthenticationFilter;
import com.ottogi.be.auth.filter.AuthorizationFilter;
import com.ottogi.be.auth.filter.CustomLogoutFilter;
import com.ottogi.be.auth.handler.CustomAccessDeniedHandler;
import com.ottogi.be.auth.service.JwtService;
import com.ottogi.be.auth.util.JwtUtil;
import com.ottogi.be.common.infra.RedisService;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final MemberRepository memberRepository;
    private final JwtService jwtService;
    private final RedisService redisService;
    private final JwtUtil jwtUtil;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(AuthenticationConfiguration configuration) {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable);
        http
                .formLogin(AbstractHttpConfigurer::disable);
        http
                .httpBasic(AbstractHttpConfigurer::disable);
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/auth/login", "/members").permitAll()
                        .requestMatchers("/auth/refresh").permitAll()
                        .requestMatchers("/auth/phone/*", "/members/check-nickname", "/members/check-phone", "/members/check-id").permitAll()
                        //.requestMatchers("/chat/**").hasRole("OWNER")
                        .anyRequest().authenticated())
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedHandler(accessDeniedHandler)
                );
        http
                .addFilterAt(new AuthenticationFilter(authenticationManager(authenticationConfiguration), jwtService, jwtUtil), UsernamePasswordAuthenticationFilter.class);
        http
                .addFilterBefore(new AuthorizationFilter(memberRepository, jwtUtil), AuthenticationFilter.class);
        http
                .addFilterBefore(new CustomLogoutFilter(redisService, jwtUtil), LogoutFilter.class);
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
