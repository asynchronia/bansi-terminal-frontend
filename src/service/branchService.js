import { getBranchList } from "../api";

export const getBranchListReq = async (body) => {
    const response = await getBranchList(body);
    return response;
};

