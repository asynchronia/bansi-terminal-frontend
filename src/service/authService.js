import { login, signin } from "../api";

export const loginReq = async (body) => {
    const response = await login(body);
    return response;
};

export const signinReq = async (body) => {
    const response = await signin(body);
    return response;
};