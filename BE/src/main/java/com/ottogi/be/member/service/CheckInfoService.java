package com.ottogi.be.member.service;

import com.ottogi.be.member.exception.LoginIdDuplicationException;
import com.ottogi.be.member.exception.NicknameDuplicationException;
import com.ottogi.be.member.exception.PhoneDuplicationException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CheckInfoService {

    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public void checkId(String loginId) {
        if (memberRepository.findByLoginId(loginId).isPresent()) {
            throw new LoginIdDuplicationException();
        }
    }

    @Transactional(readOnly = true)
    public void checkNickname(String nickname) {
        if (memberRepository.findByNickname(nickname).isPresent()) {
            throw new NicknameDuplicationException();
        }
    }

    @Transactional(readOnly = true)
    public void checkPhone(String phone) {
        if (memberRepository.findByPhone(phone).isPresent()) {
            throw new PhoneDuplicationException();
        }
    }
}
