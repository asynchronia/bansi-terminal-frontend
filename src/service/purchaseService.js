import { getPurchaseOrderList, createPurchaseOrder, getPurchaseOrderDetails, purchaseOrderStatusChange, convertToSalesOrder } from "../api";

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

export const purchaseOrderStatusChangeReq = async (body) => {
  const response = await purchaseOrderStatusChange(body);
  return response;
};
export const convertToSalesOrderReq = async (body) => {
  const response = await convertToSalesOrder(body);
  return response;
};