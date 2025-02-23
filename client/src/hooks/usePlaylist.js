import { useQuery } from "@tanstack/react-query";
import {
  fetchALlPlaylists,
  fetchALlPlaylistsByUser,
} from "../api/services/playlistService";

export const useFetchALlPlaylists = () => {
  return useQuery({
    queryFn: fetchALlPlaylists,
    queryKey: ["playlists/all-playlists"],
    onError: (error) =>
      console.error("Error fetching non-deleted users: ", error),
  });
};

export const useFetchALlPlaylistsByUser = () => {
  return useQuery({
    queryFn: fetchALlPlaylistsByUser,
    queryKey: ["playlists"],
    onError: (error) =>
      console.error("Error fetching non-deleted users: ", error),
  });
};
