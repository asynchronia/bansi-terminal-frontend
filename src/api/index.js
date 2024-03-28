import axios from "axios";

const baseUrl = "http://localhost:3000"

const API_URL = {
    createItem: "/api/items/create",
    createClient: "/api/clients/create",
    getItems:"/api/items/list",
    getCategories:"/api/categories/list",
    createCategory:"/api/categories/create",
    deleteItem:"/api/items/delete",
    getClients:"/api/clients/list",
    getInvoices:"/api/invoices/list",
    searchItem:"/api/items/search",
    getOrderList:"/api/orders/list",
    getPaymentList:"/api/payments/list",
    getItemData:"/api/items/get",
    getInvoiceDetails:"/api/invoices/id/",
    getPaymentDetails : "/api/payments/id"
};

const getIdToken = () => localStorage.getItem("id_token");
const getclientId = () => localStorage.getItem("client_id");
const getsessionId = () => localStorage.getItem("sessionId");

const getHeaders = () => {
    const idToken = getIdToken();
    const clientId = getclientId();
    const sessionId = getsessionId();

    if (idToken) {
        return {
            Authorization: `Bearer ${idToken}`,
            clientId: clientId,
            sessionId: sessionId || "",
        };
    } else {
        return { sessionId: sessionId || "" };
    }
};

export async function createItem(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.createItem}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function createClient(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.createClient}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function getItems(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.getItems}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function getItemData(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.getItemData}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function getInvoices(body) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseUrl}${API_URL.getInvoices}`, body)
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

export async function getPaymentDetails(id,body) {
    return new Promise((resolve, reject) => {
        axios
            .get(`${baseUrl}${API_URL.getPaymentDetails}/${id}`,body)
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
            .post(`${baseUrl}${API_URL.getPaymentList}`, body)
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

export async function getClients(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.getClients}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            })
    });
}

export async function getCategories(body) {
    return new Promise((resolve) => {
        axios
            .get(`${baseUrl}${API_URL.getCategories}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function createCategory(body) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseUrl}${API_URL.createCategory}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            })
            .catch(error => {
                reject(error);
            });
    }).catch(error =>{
        console.log(error);
        return error.response.data;
    });
}
export async function deleteItem(body) {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseUrl}${API_URL.deleteItem}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            })
            .catch(error => {
                reject(error);
            });
    }).catch(error =>{
        console.log(error);
        return error.response.data;
    });
}

export async function searchItem(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.searchItem}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}

export async function getOrderList(body) {
    return new Promise((resolve) => {
        axios
            .post(`${baseUrl}${API_URL.getOrderList}`, body)
            .then((res) => {
                resolve(res.data);
                return res.data;
            });
    });
}
// export async function stopLLMResponse() {
//     return new Promise((resolve) => {
//         axios
//             .get(`${baseUrl}${API_URL.stopLLMResponse}`, {
//                 headers: getHeaders(),
//             })
//             .then((res) => {
//                 resolve(res.data);
//                 return res.data;
//             });
//     });
// }
