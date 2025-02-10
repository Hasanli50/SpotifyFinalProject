import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllNonDeletedArtists,
  getAllDeletedArtists,
  getArtistById,
  register,
  login,
  verifyAccount,
//   deleteAccount,
//   freezeAccount,
//   unfreezeAccount,
//   banAccount,
//   unBanAccount,
//   resetPassword,
//   forgotPassword,
//   updatePassword,
  updateArtistInfo,
} from "../api/services/artistService.js";

export const useAllNonDeletedArtists = () => {
  return useQuery({
    queryFn: getAllNonDeletedArtists,
    queryKey: ["artists/nonDeletedArtists"],
    onError: (error) =>
      console.error("Error fetching non-deleted artists: ", error),
  });
};

export const useAllDeletedArtists = () => {
  return useQuery({
    queryFn: getAllDeletedArtists,
    queryKey: ["artists/deletedArtists"],
    onError: (error) =>
      console.error("Error fetching deleted artists: ", error),
  });
};

export const useArtistById = (id) => {
  return useQuery({
    enabled: !!id,
    queryFn: () => getArtistById(id),
    queryKey: ["artists", id],
    onError: (error) =>
      console.error(`Error fetching artist with ID ${id}: `, error),
  });
};

export const useRegisterArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: () => queryClient.invalidateQueries("artists"),
    onError: (error) => console.error("Error registering artist: ", error),
  });
};

export const useUpdateArtistInfo = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedArtist) => updateArtistInfo(id, updatedArtist),
    onSuccess: () => queryClient.invalidateQueries(["artists", id]),
    onError: (error) =>
      console.error(`Error updating artist with ID ${id}: `, error),
  });
};

export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: verifyAccount,
    onError: (error) => console.error("Error verifying account: ", error),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onError: (error) => console.error("Error logging in: ", error),
  });
};
