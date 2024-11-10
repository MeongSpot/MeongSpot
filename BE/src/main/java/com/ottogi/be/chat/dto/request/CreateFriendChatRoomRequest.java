package com.ottogi.be.chat.dto.request;

import com.ottogi.be.chat.dto.CreateFriendChatRoomDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateFriendChatRoomRequest {
    private Long friendId;

    public CreateFriendChatRoomDto toDto(String loginId) {
        return CreateFriendChatRoomDto.builder()
                .friendId(friendId)
                .loginId(loginId)
                .build();
    }
}
