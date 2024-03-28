import { getInvoices,getPaymentList,getPaymentDetails} from "../api";

export const getInvoicesReq = async (body = {}) => {
    const response = await getInvoices(body);
    if(response.success && response.success === true){
        return response.payload.data;
    }
    return [];
};

export const getPaymentDetailsReq = async (body = {}) => {
    const response = await getPaymentDetails(body);
    if(response.success && response.success === true){
        return response.payload.data;
    }
    return [];
};

export const getPaymentReq = async (body = {}) => {
    const response = await getPaymentList(body);
    if(response.success && response.success === true){
        return response.payload.data;
    }
    return [];
};

