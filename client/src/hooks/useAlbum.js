import {  useQuery, } from "@tanstack/react-query";
import { getAllAlbums } from "../api/services/albumService.js";

export const useAllAlbums = () => {
  return useQuery({
    queryFn: getAllAlbums,
    queryKey: ["albums"],
    onError: (error) =>
      console.error("Error fetching albums: ", error),
  });
};
