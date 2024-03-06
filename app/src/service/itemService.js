import { createItem } from "api";

export const createItemReq = async (body) => {
    const response = await createItem(body);
    return response;
};