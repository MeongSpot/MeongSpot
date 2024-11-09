import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dogService } from "@/services/dogService";
import { DogList } from "@/types/dogInfo";

export const useDog = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [myDogs, setMyDogs] = useState<DogList[]>([]);

  // 반려견 품종 목록 조회
  const getDogBreeds = async () => {
    setIsLoading(true);
    try {
      const breeds = await dogService.getDogBreeds();
      setDogBreeds(breeds.data);
    } catch (error) {
      console.error("Failed to get dog breeds:", error);
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
      console.error("Failed to register dog:", error);
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
      console.error("Failed to get my dogs:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return { dogBreeds, myDogs, registerDog, getDogBreeds, getMyDogs, isLoading };
};