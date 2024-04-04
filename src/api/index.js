import axios from "axios";
import { reject } from "lodash";

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";

const API_URL = {
    createItem: "/api/items/create",
    createClient: "/api/clients/create",
    getItems: "/api/items/list",
    getCategories: "/api/categories/list",
    createCategory: "/api/categories/create",
    deleteItem: "/api/items/delete",
    getClients: "/api/clients/list",
    getInvoices: "/api/invoices/list",
    searchItem: "/api/items/search",
    getOrderList: "/api/orders/list",
    getPaymentList: "/api/payments/list",
    login: "/api/users/login",
    signin:'/api/users/signup',
    createAgreement: '/api/agreements/create',
    getBranchList: '/api/branch/list',
    createBranch: '/api/branch/create',
    getWarehouseList :'/api/branch/warehouse-list',
    getUserList:'/api/users/get/users',
    getUserRole: '/api/roles/list',
    getItemData:"/api/items/get",
    getInvoiceDetails:"/api/invoices/id/",
    getPaymentDetails : "/api/payments/id",
    getOrderDetails : "/api/orders/id",
    getAgreement: "/api/agreements/agreement",
    editItem:"/api/items/update",
    getTaxes:"/api/taxes/list",
    getClientWithId:"/api/clients/get",
};

const getAccessToken = () => localStorage.getItem("accessToken");
const getIdToken = () => localStorage.getItem("id_token");
const getclientId = () => localStorage.getItem("client_id");
const getsessionId = () => localStorage.getItem("sessionId");

const getHeaders = () => {
    const accessToken = getAccessToken();
    // const clientId = getclientId();
    // const sessionId = getsessionId();

    if (accessToken) {
        return {
            Authorization: `Bearer ${accessToken}`,
            // clientId: clientId,
            // sessionId: sessionId || "",
        };
    }/*  else {
        return { sessionId: sessionId || "" };
    } */
};

export async function createItem(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.createItem}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function createClient(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.createClient}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function createAgreement(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.createAgreement}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            })
    });
}

export async function getItems(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.getItems}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function getClientWithId(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.getClientWithId}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}


export async function getAgreement(body) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseUrl}${API_URL.getAgreement}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
            }).catch(error => {
                reject(error.response.status);
            });
    });
}

export async function getTaxes() {
    return new Promise((resolve, reject) => {
        axios
            .get(`${baseUrl}${API_URL.getTaxes}`, { headers: getHeaders() })
            .then((res) => {
                
                resolve(res.data);
               
            }).catch(error => {
                reject(error.response.status);
            });
    });
}

export async function editItem(body) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseUrl}${API_URL.editItem}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
            }).catch(error => {
                reject(error.response.status);
            });
    });
}

export async function getUserList(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.getUserList}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function getUserRole() {
    return new Promise((resolve) => {
        axios
            .get(`${baseUrl}${API_URL.getUserRole}`, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function getBranchList(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.getBranchList}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function getWarehouseList(body) {
    return new Promise((resolve) => {
        axios
            .get(`${baseUrl}${API_URL.getWarehouseList}`,body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}



export async function createBranch(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.createBranch}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function getItemData(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.getItemData}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function getInvoices(body) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseUrl}${API_URL.getInvoices}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            }).catch(error => {
                reject(error);
            });
    }).catch(error => {
        console.log(error);
        return error?.response;
    });
}

export async function getPaymentDetails(id,body) {
    return new Promise((resolve, reject) => {
        axios
            .get(`${baseUrl}${API_URL.getPaymentDetails}/${id}`, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            }).catch(error => {
                reject(error);
            });
    }).catch(error =>{
        console.log(error);
        return error?.response;
    });
}

export async function getOrderDetails(id,body) {
    return new Promise((resolve, reject) => {
        axios
            .get(`${baseUrl}${API_URL.getOrderDetails}/${id}`, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            }).catch(error => {
                reject(error);
            });
    }).catch(error =>{
        console.log(error);
        return error?.response;
    });
}

export async function getPaymentList(body) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseUrl}${API_URL.getPaymentList}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            }).catch(error => {
                reject(error);
            });
    }).catch(error => {
        console.log(error);
        return error?.response;
    });
}

export async function getClients(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.getClients}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            })
    });
}

export async function getCategories(body) {
    return new Promise((resolve) => {
        axios
            .get(`${baseUrl}${API_URL.getCategories}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function createCategory(body) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseUrl}${API_URL.createCategory}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            })
            .catch(error => {
                reject(error);
            });
    }).catch(error => {
        console.log(error);
        return error.response.data;
    });
}
export async function deleteItem(body) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseUrl}${API_URL.deleteItem}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            })
            .catch(error => {
                reject(error);
            });
    }).catch(error => {
        console.log(error);
        return error.response.data;
    });
}

export async function searchItem(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.searchItem}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function getOrderList(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.getOrderList}`, body, { headers: getHeaders() })
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function login(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.login}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            })
            .catch((error) => {
                console.log(error);
                resolve(error.response.data);
            });
    });
}


export async function signin(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.signin}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            })
            .catch((error) => {
                console.log(error);
                resolve(error.response.data);
            });
    });
}

