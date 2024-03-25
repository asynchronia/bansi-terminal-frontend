import { getUserList,} from "../api";

export const getUserListReq = async (body) => {
    const response = await getUserList(body);
    return response;
};