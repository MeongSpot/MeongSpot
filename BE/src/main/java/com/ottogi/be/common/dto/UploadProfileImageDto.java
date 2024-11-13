package com.ottogi.be.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@AllArgsConstructor
public class UploadProfileImageDto {
    private String oldProfileImage;
    private MultipartFile newProfileImage;
}
