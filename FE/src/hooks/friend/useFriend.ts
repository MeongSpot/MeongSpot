import { useState } from "react";
import { friendService } from "@/services/friendService";
import { FriendListInfo } from "@/types/friend";
import { set } from "lodash";

export const useFriend = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [friendsList, setFriendsList] = useState<FriendListInfo[]>([]);
  const [filteredFriendsList, setFilteredFriendsList] = useState<FriendListInfo[]>([]);
  const [friendsCount, setFriendsCount] = useState(0);

  // 친구 목록 조회
  const getFriends = async () => {
    setIsLoading(true);
    try {
      const friends = await friendService.getFriends();
      setFriendsList(friends.data);
      setFilteredFriendsList(friends.data);
      setFriendsCount(friends.data.length);
    } catch (error) {
      console.error("Failed to get friends:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 친구 끊기 (삭제)
  const deleteFriend = async (friendId: number) => {
    setIsLoading(true);
    try {
      const response = await friendService.deleteFriend(friendId);
      setFriendsList(friendsList.filter((friend) => friend.id !== friendId));
      setFilteredFriendsList(filteredFriendsList.filter((friend) => friend.id !== friendId));
      setFriendsCount(friendsCount - 1);
    } catch (error) {
      console.error("Failed to delete friend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { getFriends, friendsList, friendsCount, isLoading, filteredFriendsList, setFilteredFriendsList, deleteFriend };
};
