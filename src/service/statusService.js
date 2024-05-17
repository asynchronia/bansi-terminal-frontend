import { updateClientStatus, updateItemStatus } from "../api";

export const updateClientStatusReq = async (body) => {
    const response = await updateClientStatus(body);
    return response;
};

export const updateItemStatusReq = async (body) => {
    const response = await updateItemStatus(body);
    return response;
};