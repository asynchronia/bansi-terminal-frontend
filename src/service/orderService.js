import { getOrderList,getOrderDetails, getEstimates, getEstimate } from "../api";

export const getOrdersReq = async (body = {}) => {
    const response = await getOrderList(body);
    return response.payload.data;
};


export const getOrderDetailsReq = async(body={})=>{
    const response =await getOrderDetails(body);
    return response.payload;
}

export const getEstimatesReq = async(body={})=>{
    const response =await getEstimates(body);
    return response.payload;
}

export const getEstimateReq = async(body={}, id)=>{
    const response =await getEstimate(body, id);
    return response.payload;
}