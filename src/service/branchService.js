import { getBranchList, createBranch } from "../api";

export const getBranchListReq = async (body) => {
    const response = await getBranchList(body);
    return response;
};

export const createBranchReq = async (body) => {
    const response = await createBranch(body);
    return response;
};

