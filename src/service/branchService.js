import { getBranchList, createBranch, getWarehouseList, getUserRole } from "../api";

export const getBranchListReq = async (body) => {
    const response = await getBranchList(body);
    return response;
};

export const createBranchReq = async (body) => {
    const response = await createBranch(body);
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
