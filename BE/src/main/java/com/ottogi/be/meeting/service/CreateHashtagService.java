package com.ottogi.be.meeting.service;

import com.ottogi.be.meeting.domain.Hashtag;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.repository.HashTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateHashtagService {

    private final HashTagRepository hashTagRepository;

    @Transactional
    public void addHashtag(List<String> hashtagList, Meeting meeting) {

        if (hashtagList != null && !hashtagList.isEmpty()) {
            List<Hashtag> tags = new ArrayList<>();
            for (String hashtagItem : hashtagList) {
                Hashtag tag= Hashtag.builder()
                        .meeting(meeting)
                        .tag(hashtagItem)
                        .build();
                tags.add(tag);
            }
            hashTagRepository.saveAll(tags);
        }

    }
}
