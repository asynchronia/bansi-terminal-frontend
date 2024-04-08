import { getUserList, getUserRole, getWarehouseList} from "../api";

export const getUserListReq = async (body) => {
    const response = await getUserList(body);
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

