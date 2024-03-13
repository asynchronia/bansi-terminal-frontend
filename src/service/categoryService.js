import { createCategory } from "../api";

export const createCategoryReq = async (body) => {
    
        const response = await createCategory(body);
        return response;
    
};
