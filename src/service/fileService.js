import { getUploadUrl } from "../api";

export const getUploadUrlReq = async () => {
    const response = await getUploadUrl();
    return response;
}
