package com.ottogi.be.chat.dto.request;

import com.ottogi.be.chat.dto.CreatePersonalChatRoomDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePersonalChatRoomRequest {
    private Long interlocutorId;

    public CreatePersonalChatRoomDto toDto(String loginId) {
        return CreatePersonalChatRoomDto.builder()
                .interlocutorId(interlocutorId)
                .loginId(loginId)
                .build();
    }
}
