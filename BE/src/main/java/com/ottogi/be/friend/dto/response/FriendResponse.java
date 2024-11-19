package com.ottogi.be.friend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendResponse {
    private Long id;
    private String profileImage;
    private String nickname;
    private List<String> dogNames;
}
