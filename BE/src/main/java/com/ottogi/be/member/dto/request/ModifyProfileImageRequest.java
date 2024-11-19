package com.ottogi.be.member.dto.request;

import com.ottogi.be.member.dto.ModifyProfileImageDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ModifyProfileImageRequest {
    private MultipartFile profileImage;

    public ModifyProfileImageDto toDto(String loginId) {
        return ModifyProfileImageDto.builder()
                .profileImage(profileImage)
                .loginId(loginId)
                .build();
    }
}