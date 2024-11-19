package com.ottogi.gps.auth.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ottogi.gps.common.constants.JwtConstants;
import com.ottogi.gps.common.dto.response.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;

import java.io.IOException;

public class ResponseUtil {

    private ResponseUtil() {}

    public static void setResponse(HttpServletResponse response, String code, String message, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ApiResponse<?> apiResponse = new ApiResponse<>(code, message, null);
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(apiResponse);
        response.getWriter().write(jsonResponse);
    }

    public static Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(JwtConstants.COOKIE_EXPIRED);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");

        return cookie;
    }
}
