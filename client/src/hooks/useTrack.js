import { useQuery } from "@tanstack/react-query";
import { getAllTracks } from "../api/services/trackService.js";

export const useAllTracks = () => {
  return useQuery({
    queryFn: getAllTracks,
    queryKey: ["tracks"],
    onError: (error) => console.error("Error fetching albums: ", error),
  });
};
