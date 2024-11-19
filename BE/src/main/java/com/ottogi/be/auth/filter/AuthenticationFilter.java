package com.ottogi.be.auth.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ottogi.be.auth.domain.RefreshToken;
import com.ottogi.be.auth.dto.LoginMemberInfo;
import com.ottogi.be.auth.dto.request.LoginRequest;
import com.ottogi.be.auth.service.JwtService;
import com.ottogi.be.auth.util.ResponseUtil;
import com.ottogi.be.auth.util.JwtUtil;
import com.ottogi.be.common.constants.JwtConstants;
import com.ottogi.be.common.constants.RedisExpiredTimeConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Iterator;

public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtUtil jwtUtil;

    public AuthenticationFilter(AuthenticationManager authenticationManager, JwtService jwtService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.jwtUtil = jwtUtil;
        setFilterProcessesUrl("/auth/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        LoginRequest loginRequest;

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            loginRequest = objectMapper.readValue(messageBody, LoginRequest.class);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }

        String loginId = loginRequest.getLoginId();
        String password = loginRequest.getPassword();

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(loginId, password, null);

        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        LoginMemberInfo userDetails = (LoginMemberInfo) authResult.getPrincipal();
        String loginId = userDetails.getLoginId();

        Collection<? extends GrantedAuthority> authorities = authResult.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        String access = jwtUtil.createJwt("access", loginId, role, JwtConstants.ACCESS_EXPIRED);
        String refresh = jwtUtil.createJwt("refresh", loginId, role, RedisExpiredTimeConstants.TOKEN_EXPIRED);

        RefreshToken refreshToken = RefreshToken.builder()
                .loginId(loginId)
                .refreshToken(refresh)
                .build();

        jwtService.saveRefreshToken(refreshToken);

        response.setHeader("Authorization", "Bearer " + access);
        response.addCookie(ResponseUtil.createCookie("refresh", refresh));

        ResponseUtil.setResponse(response, "AU100", "일반 로그인 성공", HttpStatus.OK);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        ResponseUtil.setResponse(response, "AU000", "일반 로그인 실패", HttpStatus.UNAUTHORIZED);
    }
}
