import { getOrderList } from "../api";

export const getOrdersReq = async (body = {}) => {
    const response = await getOrderList(body);
    return response.payload.data;
};