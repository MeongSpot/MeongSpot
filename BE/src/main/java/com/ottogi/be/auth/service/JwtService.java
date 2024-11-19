package com.ottogi.be.auth.service;

import com.ottogi.be.auth.domain.RefreshToken;
import com.ottogi.be.auth.exception.RefreshVerificationFailedException;
import com.ottogi.be.auth.util.JwtUtil;
import com.ottogi.be.auth.util.ResponseUtil;
import com.ottogi.be.common.constants.JwtConstants;
import com.ottogi.be.common.constants.RedisExpiredTimeConstants;
import com.ottogi.be.common.constants.RedisFieldConstants;
import com.ottogi.be.common.constants.RedisKeyConstants;
import com.ottogi.be.common.infra.RedisService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final RedisService redisService;
    private final JwtUtil jwtUtil;

    public void saveRefreshToken(RefreshToken refreshToken) {
        redisService.setHashData(generatePrefixedKey(refreshToken.getLoginId()), RedisFieldConstants.REFRESH_TOKEN, refreshToken.getRefreshToken(), RedisExpiredTimeConstants.TOKEN_EXPIRED);
    }

    public void reissueAccess(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = getRefreshTokenFromCookies(request);

        if (refreshToken == null) {
            throw new RefreshVerificationFailedException();
        }

        try {
            jwtUtil.isExpired(refreshToken);
        } catch (ExpiredJwtException e) {
            throw new RefreshVerificationFailedException();
        }

        String loginId = jwtUtil.getLoginId(refreshToken);

        String savedRefresh = (String) redisService.getHashData(generatePrefixedKey(loginId), RedisFieldConstants.REFRESH_TOKEN);

        if (savedRefresh == null || !savedRefresh.equals(refreshToken)) {
            throw new RefreshVerificationFailedException();
        }

        String role = jwtUtil.getRole(refreshToken);

        String newAccess = jwtUtil.createJwt("access", loginId, role, JwtConstants.ACCESS_EXPIRED);
        String newRefresh = jwtUtil.createJwt("refresh", loginId, role, RedisExpiredTimeConstants.TOKEN_EXPIRED);

        RefreshToken newRefreshToken = RefreshToken.builder()
                .loginId(loginId)
                .refreshToken(newRefresh)
                .build();

        saveRefreshToken(newRefreshToken);

        response.setHeader("Authorization", "Bearer " + newAccess);
        response.addCookie(ResponseUtil.createCookie("refresh", newRefresh));
    }

    private String generatePrefixedKey(String loginId) {
        return RedisKeyConstants.TOKEN + loginId;
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
