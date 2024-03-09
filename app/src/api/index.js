import axios from "axios";

const baseUrl = "http://localhost:3000"

const API_URL = {
    craeteItem: "/api/items/create",
<<<<<<< HEAD
    getItems:"/api/items/list",
    getCategories:"/api/categories/list"
=======
>>>>>>> 26e99edecc52b6c2af83e21db33d23298821d399
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
