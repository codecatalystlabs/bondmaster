"use client";

import apiClient from "./apiClient";
import { Car } from "@/types/car";
import { Cost } from "@/types/cost-management";
import { Customer } from "@/types/customer";
import { Expense, Invoice } from "@/types/expense";
import { NewSale, Sale2 } from "@/types/sale";
import { LoginUser, UserInfo } from "@/types/user";
import axios from "axios";

// Interfaces
interface ICreateUser {
    url: string;
    userInfo: Partial<UserInfo>;
}

interface ILoginUser {
    url: string;
    userData: Partial<LoginUser>;
}

interface IExpense {
    url: string;
    expense: Partial<Expense>;
}

interface ICarExpense {
    url: string;
    expense: Partial<Cost>;
}

interface ICreateCustomer {
    url: string;
    customerInfo: Partial<Customer>;
}

interface ICreateCar {
    url: string;
    carInfo: Partial<Car> | FormData
}

interface INvoice {
    url: string;
    invoiceData: Partial<Invoice> 
}

interface ISale {
    url: string;
    sale: Partial<Sale2>;
}

interface INewSale {
    url: string;
    sale: Partial<NewSale>;
}


interface IDeleteUser {
    url: string;
    password: string;
}

// Generic Fetcher for GET requests
const fetcher = async (url: string) => {
    try {
        const { data } = await apiClient.get(url);
        return data;
    } catch (error) {
        console.error("Fetcher error:", error);
        throw error;
    }
};

// API Functions
const createUser = async ({ url, userInfo }: ICreateUser) => {
    const { data } = await apiClient.post(url, userInfo);
    return data;
};

const createInvoice = async ({ url, invoiceData }: INvoice) => {
    const { data } = await apiClient.post(url, invoiceData);
    return data;
};

const addInvoiceToCar = async ({ url, invoiceNumber }: any) => {
    const { data } = await apiClient.put(url, invoiceNumber);
    return data;
}

const createCustomer = async ({ url, customerInfo }: ICreateCustomer) => {
    const { data } = await apiClient.post(url, customerInfo);
    return data;
};

const editUser = async ({ url, userInfo }: ICreateUser) => {
    const { data } = await apiClient.patch(url, userInfo);
    return data;
};

const login = async ({ url, userData }: ILoginUser) => {
    const { data } = await axios.post(url, userData);
    return data;
};

const editCustomer = async ({ url, customerInfo }: ICreateCustomer) => {
    const { data } = await apiClient.put(url, customerInfo);
    return data;
};

const addCar = async ({ url, carInfo }: ICreateCar) => {
    try {
        const { data } = await apiClient.post(url, carInfo,{
            headers: {
              "Content-Type": "multipart/form-data", // Not strictly needed, but added for clarity
            },
          });
        return data;
    } catch (error) {
        console.log(error,"AM ERROR")
    }

};

const updateCar = async ({ url, carInfo }: ICreateCar) => {
    try {
        const { data } = await apiClient.put(url, carInfo,{
            headers: {
              "Content-Type": "multipart/form-data", // Not strictly needed, but added for clarity
            },
          });
        return data;
    } catch (error) {
        console.log(error,"AM ERROR")
    }

};

const addCarDetails = async ({ url, carInfo }: any) => {
    try {
        const { data } = await apiClient.put(url, carInfo,{
            headers: {
              "Content-Type": "multipart/form-data", // Not strictly needed, but added for clarity
            },
          });
        return data;
    } catch (error) {
        console.log(error,"AM ERROR")
    }

};

const addCarExpenses = async ({ url, expense }: ICarExpense) => {
    const { data } = await apiClient.post(url, expense);
    return data;
};

const addCompanyExpenses = async ({ url, expense }: IExpense) => {
    const { data } = await apiClient.post(url, expense);
    return data;
};

const updateExpense = async ({ url, expense }: IExpense) => {
    const { data } = await apiClient.put(url, expense);
    return data;
};

const addSale = async ({ url, sale }: ISale) => {
    const { data } = await apiClient.post(url, sale);
    return data;
};

const addPayment = async ({ url, payment }: any) => {
    console.log(payment,"MAMAJAJJA")
    const { data } = await apiClient.post(url, payment);
    return data;
};

const addDeposit = async ({ url, sale }: any) => {
    const { data } = await apiClient.post(url, sale);
    return data;
};

const addInvoice = async ({ url, invoice }: any) => {
    const { data } = await apiClient.post(url, invoice);
    return data;
};

const addCarSaleJapan = async ({ url, sale }: INewSale) => {
    const { data } = await apiClient.post(url, sale);
   return data
}
const updateSale = async ({ url, sale }: ISale) => {
    const { data } = await apiClient.put(url, sale);
    return data;
};

const deleteUser = async ({ url, password }: IDeleteUser) => {
    const { data } = await apiClient.delete(url, { data: { password } });
    return data;
}

const deleteSale = async (url:string) => {
    const { data } = await apiClient.delete(url);
    return data;
}

// Export API functions
export {
    createUser,
    fetcher,
    editUser,
    editCustomer,
    createCustomer,
    addCar,
    addCompanyExpenses,
    updateExpense,
    addCarExpenses,
    addSale,
    login,
    deleteUser,
    updateCar,
    createInvoice,
    addInvoiceToCar,
    addCarSaleJapan,
    updateSale,
    deleteSale,
    addInvoice,
    addDeposit,
    addPayment,
    addCarDetails
};
