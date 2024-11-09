import axiosInstance from '@/services/axiosInstance';
import { DogListResponse, RegisterDogResponse, DogBreedsResponse } from '@/types/dogInfo';


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
};