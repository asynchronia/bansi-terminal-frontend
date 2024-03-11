import axios from "axios";

const baseUrl = "http://localhost:3000"

const API_URL = {
    craeteItem: "/api/items/create",
    getItems:"/api/items/list",
    getCategories:"/api/categories/list",
    createCategory:"/api/categories/create"
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
            .post(`${baseUrl}${API_URL.craeteItem}`, body)
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
