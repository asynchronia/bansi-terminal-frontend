import { getPurchaseOrderList,createPurchaseOrder,getPurchaseOrderDetails } from "../api";

export const getPurchaseOrderListReq = async (body) => {
    const response = await getPurchaseOrderList(body);
    return response.payload;
  };

  export const getPurchaseOrderDetailsReq = async (body) => {
    const response = await getPurchaseOrderDetails(body);
    return response.payload;
  };

export const createPurchaseOrderReq = async (body) => {
    const response = await createPurchaseOrder(body);
    return response;
  };