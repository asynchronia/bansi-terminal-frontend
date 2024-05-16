import { updateUserStatus, updateItemStatus } from "../api";

export const updateUserStatusReq = async (body) => {
    const response = await updateUserStatus(body);
    return response;
};

export const updateItemStatusReq = async (body) => {
    const response = await updateItemStatus(body);
    return response;
};