package com.ottogi.be.chat.dto.response;

import com.ottogi.be.chat.dto.ChatMessageDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Slice;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FindChatRoomResponse {
    private Long myId;
    private String nickname;
    private String profileImage;
    private Slice<ChatMessageDto> chatMessageDtos;
}
