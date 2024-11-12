import axiosInstance from '@/services/axiosInstance';
import { DogListResponse, RegisterDogResponse, DogBreedsResponse, DogNameResponse } from '@/types/dogInfo';

export const dogService = {
  // 반려견 품종 리스트 조회
  getDogBreeds: async (): Promise<DogBreedsResponse> => {
    try {
      const response = await axiosInstance.get('/api/dogs/breed');
      return response.data;
    } catch (error) {
      console.error('Failed to get dog breeds:', error);
      throw error;
    }
  },

  // 반려견 등록
  registerDog: async (data: FormData): Promise<RegisterDogResponse> => {
    try {
      const response = await axiosInstance.post('/api/dogs', data);
      return response.data;
    } catch (error) {
      console.error('Failed to register dog:', error);
      throw error;
    }
  },

  // 나의 반려견 리스트 조회
  getMyDogs: async (): Promise<DogListResponse> => {
    try {
      const response = await axiosInstance.get('/api/dogs');
      return response.data;
    } catch (error) {
      console.error('Failed to get my dogs:', error);
      throw error;
    }
  },

  // 나의 반려견 이름 리스트 조회
  getMyDogsName: async () => {
    try {
      const response = await axiosInstance.get<DogNameResponse>('/api/dogs/name');
      if (response.data.code === 'DO107') {
        return response.data.data;
      }
      if (response.data.code === 'ME003') {
        throw new Error('사용자 조회 실패');
      }
      return [];
    } catch (error) {
      console.error('Failed to get dog names:', error);
      return [];
    }
  },

  // 반려견 상세 조회
  getDogDetail: async (dogId: number) => {
    try {
      const response = await axiosInstance.get(`/api/dogs/${dogId}/details`);
      if (response.data.code === 'DO110') {
        return response.data;
      }
      if (response.data.code === 'DO002') {
        throw new Error('반려견 상세 정보 조회 실패');
      }
    } catch (error) {
      console.error('Failed to get dog detail:', error);
      throw error;
    }
  },

  // 사용자 반려견 목록 조회
  getUserDogs: async (userId: number):Promise<DogListResponse> => {
    try {
      const response = await axiosInstance.get(`/api/dogs/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user dogs:', error);
      throw error;
    }
  },
};