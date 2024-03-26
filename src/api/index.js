import axios from "axios";

const baseUrl = "http://localhost:3000"

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
    getUserRole: '/api/roles/list'
};

const getAccessToken = () => localStorage.getItem("accessToken");
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
            .post(`${baseUrl}${API_URL.createAgreement}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
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

export async function getWarehouseList() {
    return new Promise((resolve) => {
        axios
            .get(`${baseUrl}${API_URL.getWarehouseList}`, { headers: getHeaders() })
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

