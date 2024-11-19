package com.ottogi.be.member.service;

import com.ottogi.be.common.dto.UploadProfileImageDto;
import com.ottogi.be.common.infra.AwsS3Service;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.dto.ModifyProfileImageDto;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URISyntaxException;

@Service
@RequiredArgsConstructor
public class ModifyProfileImageService {

    private final MemberRepository memberRepository;
    private final AwsS3Service s3Service;

    @Transactional
    public void modifyProfileImage(ModifyProfileImageDto dto) throws URISyntaxException, IOException {
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        String imagePath = s3Service.uploadMemberProfileImage(new UploadProfileImageDto(member.getProfileImage(), dto.getProfileImage()));

        member.updateProfileImage(imagePath);
    }
}
