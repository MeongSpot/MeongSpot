package com.ottogi.be.dog.service;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.exception.DogOwnerMismatchException;
import com.ottogi.be.member.domain.Member;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckOwnerService {

    public void checkIsOwner(Member member, List<Dog> dogList) {
        for (Dog dog : dogList) {
            if (dog.getMember() != member) throw new DogOwnerMismatchException();
        }
    }
}
