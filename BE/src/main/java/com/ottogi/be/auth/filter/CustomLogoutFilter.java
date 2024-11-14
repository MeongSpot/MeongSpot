package com.ottogi.be.auth.filter;

import com.ottogi.be.auth.util.JwtUtil;
import com.ottogi.be.auth.util.ResponseUtil;
import com.ottogi.be.common.constants.RedisFieldConstants;
import com.ottogi.be.common.constants.RedisKeyConstants;
import com.ottogi.be.common.infra.RedisService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean {

    private final RedisService redisService;
    private final JwtUtil jwtUtil;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String requestURI = request.getRequestURI();
        if (!requestURI.equals("/auth/logout") || !request.getMethod().equals("POST")) {
            chain.doFilter(request, response);
            return;
        }

        String refreshToken = getRefreshTokenFromCookies(request);

        if (refreshToken == null) {
            ResponseUtil.setResponse(response, "AU005", "리프레시 토큰 인증 실패", HttpStatus.UNAUTHORIZED);
            return;
        }

        try {
            jwtUtil.isExpired(refreshToken);
        } catch (ExpiredJwtException e) {
            ResponseUtil.setResponse(response, "AU005", "리프레시 토큰 인증 실패", HttpStatus.UNAUTHORIZED);
            return;
        }

        String loginId = jwtUtil.getLoginId(refreshToken);

        String savedRefresh = (String) redisService.getHashData(generatePrefixedKey(loginId), RedisFieldConstants.REFRESH_TOKEN);

        if (savedRefresh == null || !savedRefresh.equals(refreshToken)) {
            ResponseUtil.setResponse(response, "AU005", "리프레시 토큰 인증 실패", HttpStatus.UNAUTHORIZED);
            return;
        }

        redisService.deleteData(generatePrefixedKey(loginId));

        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setSecure(true);

        response.addCookie(cookie);
        ResponseUtil.setResponse(response, "AU104", "로그아웃 성공", HttpStatus.OK);
    }

    private String generatePrefixedKey(String key) {
        return RedisKeyConstants.TOKEN + key;
    }

    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refresh".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

}
