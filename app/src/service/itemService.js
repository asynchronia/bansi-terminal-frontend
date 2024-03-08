import { createItem , getItems} from "api";

export const createItemReq = async (body) => {
    const response = await createItem(body);
    return response;
};
export const getItemsReq = async (body) => {
    const response = await getItems(body);
    return response.payload.items;
};