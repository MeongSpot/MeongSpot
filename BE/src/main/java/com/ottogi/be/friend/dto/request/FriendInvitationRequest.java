package com.ottogi.be.friend.dto.request;

import com.ottogi.be.friend.dto.FriendInvitationDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendInvitationRequest {
    private Long receiverId;

    public FriendInvitationDto toDto(String loginId){
        return FriendInvitationDto.builder()
                .receiverId(this.receiverId)
                .loginId(loginId)
                .build();
    }
}
