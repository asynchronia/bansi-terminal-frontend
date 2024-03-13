import { createClient } from "../api";

export const createClientReq = async (body) => {
    const response = await createClient(body);
    return response;
};