package com.ottogi.be.friend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FriendDto {
    private Long id;
    private String profileImage;
    private String nickname;
    private String dogName;
}
