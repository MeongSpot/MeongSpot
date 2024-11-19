package com.ottogi.be.friend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DeleteFriendDto {
    private Long friendId;
    private String loginId;
}
