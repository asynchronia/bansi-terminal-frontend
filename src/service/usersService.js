import {
  getClientUsers,
  getUserById,
  getUserList,
  getUserProfile,
  getUserRole,
  getWarehouseList,
  updateUser,
} from "../api";

export const getUserListReq = async (body) => {
  const response = await getUserList(body);
  return response;
};

export const updateUserReq = async (body) => {
  const response = await updateUser(body);
  return response;
};

export const getUserByIdReq = async (body) => {
  const response = await getUserById(body);
  return response;
};

export const getClientUsersReq = async (body) => {
  const response = await getClientUsers(body);
  return response;
};

export const getUserRoleListReq = async (body) => {
  const response = await getUserRole(body);
  return response;
};

export const getUserWarehouseListReq = async (body) => {
  const response = await getWarehouseList(body);
  return response;
};

export const getUserProfileReq = async () => {
  const response = await getUserProfile();
  return response;
};
