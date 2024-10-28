export const MODULES_ENUM = {
  ITEMS: "items",
  CLIENTS: "clients",
  CATEGORIES: "categories",
  DASHBOARD: "dashboard",
  ORDERS: "orders",
  INVOICES: "invoices",
  PAYMENTS: "payments",
  DELIVERY_CHALLANS: "deliveryChallans",
  USERS: "users",
  ROLES: "roles",
  BRANCHES: "branches",
  WAREHOUSES: "warehouses",
  SETTINGS: "settings",
};

export const PERMISSIONS_ENUM = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
};

export const USER_TYPES_ENUM = {
  CLIENT: "client",
  ADMIN: "admin",
};

export const USER_GENDER_ENUM = {
  MALE: "male",
  FEMALE: "female",
  OTHERS: "others",
};

export const PAYMENT_TERM_ENUM = {
  ADVANCE: 0,
  "50% ADVANCE": 0.5,
  15: 15,
  30: 30,
  45: 45
}