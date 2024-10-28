import { createAgreement, createClient, getClients, getAgreement, getClientWithId, updateClient} from "../api";

export const createClientReq = async (body) => {
    const response = await createClient(body);
    return response;
};

export const getClientsReq = async (body) => {
    const response = await getClients(body);
    return response;
};


export const getClientWithIdReq = async (body) => {
    const response = await getClientWithId(body);
    return response;
};

export const getAgreementReq = async(body)=>{
    const response = await getAgreement(body);
    return response;
}

export const createAgreementReq = async (body) => {
    const response = await createAgreement(body);
    return response;
};

export const updateClientReq = async (body) => {
    const response = await updateClient(body);
    return response;
};