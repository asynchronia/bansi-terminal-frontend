import { login } from "../api";

export const loginReq = async (body) => {
    const response = await login(body);
    return response;
};