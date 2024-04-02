import { getUserList, getUserRole} from "../api";

export const getUserListReq = async (body) => {
    const response = await getUserList(body);
    return response;
};

export const getUserRoleListReq = async (body) => {
    const response = await getUserRole(body);
    return response;
};

