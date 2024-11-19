package com.ottogi.gps.auth.filter;

import com.ottogi.gps.auth.dto.LoginMemberInfo;
import com.ottogi.gps.auth.util.JwtUtil;
import com.ottogi.gps.auth.util.ResponseUtil;
import com.ottogi.gps.member.domain.Member;
import com.ottogi.gps.member.exception.MemberNotFoundException;
import com.ottogi.gps.member.repository.MemberRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class AuthorizationFilter extends OncePerRequestFilter {

    private final MemberRepository memberRepository;
    private final JwtUtil jwtUtil;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = authorization.split(" ")[1];

        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {
            ResponseUtil.setResponse(response, "AU003", "엑세스 토큰 만료", HttpStatus.UNAUTHORIZED);
            return;
        }

        String category = jwtUtil.getCategory(accessToken);

        if (!category.equals("access")) {
            ResponseUtil.setResponse(response, "AU004", "엑세스 토큰 인증 실패", HttpStatus.UNAUTHORIZED);
            return;
        }

        String loginId = jwtUtil.getLoginId(accessToken);

        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);

        LoginMemberInfo loginMemberInfo = new LoginMemberInfo(member);

        Authentication authToken = new UsernamePasswordAuthenticationToken(loginMemberInfo, null, loginMemberInfo.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
