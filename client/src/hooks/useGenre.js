import { useQuery } from "@tanstack/react-query";
import {
  fetchAllGenres,
  fetchGenreById,
  fetchTracksByGenre,
} from "../api/services/genreSeervice.js";

export const useGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: fetchAllGenres,
  });
};

export const useFetchGenreById = (id) => {
  return useQuery({
    queryKey: ["genres", id],
    queryFn: () => fetchGenreById(id),
    enabled: !!id,
  });
};

export const useFetchTracksByGenre = (id) => {
  return useQuery({
    queryKey: ["genres", id],
    queryFn: () => fetchTracksByGenre(id),
    enabled: !!id,
  });
};
