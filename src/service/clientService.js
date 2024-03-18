import { createClient, getClients} from "../api";

export const createClientReq = async (body) => {
    const response = await createClient(body);
    return response;
};

export const getClientsReq = async (body) => {
    const response = await getClients(body);
    return response;
};