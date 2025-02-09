import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllNonDeletedUsers,
  getAllDeletedUsers,
  getUserById,
  register,
  login,
  verifyAccount,
  deleteAccount,
  freezeAccount,
  unfreezeAccount,
  banAccount,
  unBanAccount,
  resetPassword,
  forgotPassword,
  updatePassword,
  updateUserInfo,
} from "../api/services/userService.js";


export const useAllNonDeletedUsers = () => {
  return useQuery({
    queryFn: getAllNonDeletedUsers,
    queryKey: ["users/nonDeletedUsers"],
    onError: (error) => console.error("Error fetching non-deleted users: ", error),
  });
};


export const useAllDeletedUsers = () => {
  return useQuery({
    queryFn: getAllDeletedUsers,
    queryKey: ["users/deletedUsers"],
    onError: (error) => console.error("Error fetching deleted users: ", error),
  });
};


export const useUserById = (id) => {
  return useQuery({
    enabled: !!id,
    queryFn: () => getUserById(id),
    queryKey: ["users", id],
    onError: (error) => console.error(`Error fetching user with ID ${id}: `, error),
  });
};


export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: () => queryClient.invalidateQueries("users"),
    onError: (error) => console.error("Error registering user: ", error),
  });
};


export const useUpdateUserInfo = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedUser) => updateUserInfo(id, updatedUser),
    onSuccess: () => queryClient.invalidateQueries(["users", id]),
    onError: (error) => console.error(`Error updating user with ID ${id}: `, error),
  });
};


export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: verifyAccount,
    onError: (error) => console.error("Error verifying account: ", error),
  });
};


export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteAccount(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries(["users"]);
      const previousUsers = queryClient.getQueryData(["users"]);
      queryClient.setQueryData(["users"], (oldUsers) =>
        oldUsers.filter((user) => user.id !== id)
      );
      return { previousUsers };
    },
    onSuccess: () => queryClient.invalidateQueries("users"),
    onError: (error) => console.error("Error deleting account: ", error),
  });
};


export const useFreezeAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => freezeAccount(id),
    onSuccess: () => queryClient.invalidateQueries("users"),
    onError: (error) => console.error("Error freezing account: ", error),
  });
};


export const useUnfreezeAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => unfreezeAccount(id),
    onSuccess: () => queryClient.invalidateQueries("users"),
    onError: (error) => console.error("Error unfreezing account: ", error),
  });
};


export const useBanAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => banAccount(id),
    onSuccess: () => queryClient.invalidateQueries("users"),
    onError: (error) => console.error("Error banning account: ", error),
  });
};


export const useUnbanAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => unBanAccount(id),
    onSuccess: () => queryClient.invalidateQueries("users"),
    onError: (error) => console.error("Error unbanning account: ", error),
  });
};


export const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token) => resetPassword(token),
    onSuccess: () => queryClient.invalidateQueries("users"),
    onError: (error) => console.error("Error resetting password: ", error),
  });
};


export const useForgotPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => queryClient.invalidateQueries("users"),
    onError: (error) => console.error("Error requesting forgot password: ", error),
  });
};


export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePassword(id, data),
    onSuccess: () => queryClient.invalidateQueries("users"),
    onError: (error) => console.error("Error updating password: ", error),
  });
};


export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onError: (error) => console.error("Error logging in: ", error),
  });
};
