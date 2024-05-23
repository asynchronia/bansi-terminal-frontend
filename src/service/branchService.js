import {
  getBranchList,
  getBranchById,
  createBranch,
  getWarehouseList,
  getUserRole,
  updateBranch,
  getClientBranchList,
} from "../api";

export const getBranchListReq = async (body) => {
  const response = await getBranchList(body);
  return response;
};

export const getBranchByIdReq = async (body) => {
  const response = await getBranchById(body);
  return response;
};
export const createBranchReq = async (body) => {
  const response = await createBranch(body);
  return response;
};

export const updateBranchReq = async (body) => {
  const response = await updateBranch(body);
  return response;
};

export const getWarehouseListReq = async () => {
  const response = await getWarehouseList();
  return response;
};

export const getUserRoleReq = async () => {
  const response = await getUserRole();
  return response;
};

export const getClientBranchListReq = async () => {
  const response = await getClientBranchList();
  return response;
};
