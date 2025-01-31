import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dogService } from '@/services/dogService';
import { DogList, DogName } from '@/types/dogInfo';
import { set } from 'lodash';

export const useDog = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [myDogs, setMyDogs] = useState<DogList[]>([]);
  const [userDogs, setUserDogs] = useState<DogList[]>([]);
  const [myDogsName, setMyDogsName] = useState<DogName[]>([]);
  const [dogDetail, setDogDetail] = useState<DogList | null>(null);
  const [meetingDogs, setMeetingDogs] = useState<DogList[]>([]);
  const [dogDeleteMessage, setDogDeleteMessage] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // 반려견 품종 목록 조회
  const getDogBreeds = async () => {
    setIsLoading(true);
    try {
      const breeds = await dogService.getDogBreeds();
      setDogBreeds(breeds.data);
    } catch (error) {
      console.error('Failed to get dog breeds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 반려견 등록
  const registerDog = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await dogService.registerDog(data);
      navigate('/mypage');
      return response.data;
    } catch (error) {
      console.error('Failed to register dog:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 나의 반려견 리스트 조회
  const getMyDogs = async () => {
    setIsLoading(true);
    try {
      const response = await dogService.getMyDogs();
      setMyDogs(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get my dogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 나의 반려견 이름 목록 조회
  const getMyDogsName = useCallback(async () => {
    // 이미 API 호출 중이면 리턴
    if (isFetching) return;

    setIsFetching(true);
    setIsLoading(true);
    try {
      const dogs = await dogService.getMyDogsName();
      setMyDogsName(dogs);
      return dogs;
    } catch (error) {
      console.error('Failed to get dog names:', error);
      return [];
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [isFetching]);

  // 반려견 상세 조회
  const getDogDetail = async (dogId: number) => {
    setIsLoading(true);
    try {
      const response = await dogService.getDogDetail(dogId);
      setDogDetail(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get dog detail:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 반려견 목록 조회
  const getUserDogs = async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await dogService.getUserDogs(userId);
      setUserDogs(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get user dogs:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 반려견 수정
  const updateDog = async (dogId: number, data: FormData) => {
    setIsLoading(true);
    try {
      const response = await dogService.updateDog(dogId, data);
      navigate('/mypage');
      return response.data;
    } catch (error) {
      console.error('Failed to update dog:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 모임 참여 반려견 조회
  const getMeetingDogs = async (meetingId: number, memberId: number) => {
    setIsLoading(true);
    try {
      const response = await dogService.getMeetingDogs(meetingId, memberId);
      setMeetingDogs(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get meeting dogs:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 반려견 삭제
  const deleteDog = async (dogId: number) => {
    setIsLoading(true);
    try {
      await dogService.deleteDog(dogId);
      setDogDeleteMessage('반려견이 삭제되었습니다.');
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { code } = error.response.data;
        if (code === 'DO004') {
          setDogDeleteMessage('모임 참여 반려견');
        }
      } else {
        console.error('Failed to delete dog:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dogBreeds,
    myDogs,
    registerDog,
    getDogBreeds,
    getMyDogs,
    isLoading,
    myDogsName,
    getMyDogsName,
    dogDetail,
    getDogDetail,
    userDogs,
    getUserDogs,
    updateDog,
    getMeetingDogs,
    meetingDogs,
    deleteDog,
    dogDeleteMessage,
    isFetching,
  };
};
