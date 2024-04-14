import { getExpenses } from "../api";



export const getExpensesReq = async(body={})=>{
    const response =await getExpenses(body);
    return response.payload;
}