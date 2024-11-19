package com.ottogi.gps.auth.service;

import com.ottogi.gps.auth.dto.LoginMemberInfo;
import com.ottogi.gps.member.domain.Member;
import com.ottogi.gps.member.exception.MemberNotFoundException;
import com.ottogi.gps.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);

        return new LoginMemberInfo(member);
    }
}
