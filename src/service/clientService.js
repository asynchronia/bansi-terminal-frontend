import { createAgreement, createClient, getClients} from "../api";

export const createClientReq = async (body) => {
    const response = await createClient(body);
    return response;
};

export const getClientsReq = async (body) => {
    const response = await getClients(body);
    return response;
};

export const createAgreementReq = async (body) => {
    const response = await createAgreement(body);
    return response;
};