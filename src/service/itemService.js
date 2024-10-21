import {
  createItem,
  getItems,
  deleteItem,
  searchItem,
  getItemData,
  getCategories,
  editItem,
  getTaxes,
  getAgreementItems,
} from "../api";

export const createItemReq = async (body) => {
  const response = await createItem(body);
  return response;
};
export const getItemByIdReq = async (body) => {
  const response = await getItemData(body);
  return response;
};
export const getItemsReq = async (body = {}) => {
  const response = await getItems(body);
  if (response.success && response.success === true) {
    return response.payload;
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

export const getTaxesReq = async () => {
  const response = await getTaxes();
  return response;
};

export const searchItemReq = async (body) => {
  const response = await searchItem(body);
  return response;
};

export const editItemReq = async (body) => {
  const response = await editItem(body);
  return response;
};

export const getAgreementItemsReq = async (body) => {
  const response = await getAgreementItems(body);
  if (response.success && response.success === true) {
    return response.payload.items;
  }
  return [];
};
