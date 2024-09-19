import { getPurchaseOrderList, createPurchaseOrder, getPurchaseOrderDetails, purchaseOrderStatusChange, convertToSalesOrder, updatePurchaseOrder, getPurchaseOrderStatusList } from "../api";

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

export const updatePurchaseOrderReq = async (body) => {
  const response = await updatePurchaseOrder(body);
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

export const getPurchaseOrderStatusListReq = async (body) => {
  const response = await getPurchaseOrderStatusList(body);
  return response.payload;
};
