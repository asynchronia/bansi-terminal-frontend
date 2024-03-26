import { createItem , getItems, getCategories, deleteItem, searchItem, getItemData} from "../api";

export const createItemReq = async (body) => {
    const response = await createItem(body);
    return response;
};
export const getItemsReq = async (body = {}) => {
    const response = await getItems(body);
    if(response.success && response.success === true){
        return response.payload.items;
    }
    return [];
};
export const getItemById = async (body = {}) => {
    const response = await getItemData(body);
    if(response.success && response.success === true){
        return response;
    }
    return [];
};
export const getCategoriesReq = async () => {
    const response = await getCategories();
    return response;
};

export const deletItemReq = async (body) => {
    const response = await deleteItem(body);
    return response;
};

export const searchItemReq = async (body) => {
    const response = await searchItem(body);
    return response;
};

