import {getCategories, createCategory } from "../api";

export const getCategoriesReq = async () => {
        const response = await getCategories();
        return response;
    };

export const createCategoryReq = async (body) => {
    
        const response = await createCategory(body);
        return response;
    
};
