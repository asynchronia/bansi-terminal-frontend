import { getPurchaseOrderList } from "../api";

export const getPurchaseOrderListReq = async (body) => {
    const response = await getPurchaseOrderList(body);
    return response.payload;
  };