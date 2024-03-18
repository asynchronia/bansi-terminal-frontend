import { createItem , getItems, getCategories, deleteItem} from "../api";

export const createItemReq = async (body) => {
    const response = await createItem(body);
    return response;
};
export const getItemsReq = async (body = {}) => {
    const response = await getItems(body);
    return response.payload.items;
};
export const getCategoriesReq = async () => {
    const response = await getCategories();
    return response;
};

export const deletItemReq = async (body) => {
    const response = await deleteItem(body);
    return response;
};