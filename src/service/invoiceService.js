import { getInvoices} from "../api";

export const getInvoicesReq = async (body = {}) => {
    const response = await getInvoices(body);
    if(response.success && response.success === true){
        return response.payload.data;
    }
    return [];
};