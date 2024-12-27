import { Car } from "@/types/car";
import { Customer } from "@/types/customer";
import { UserInfo } from "@/types/user";

interface ICreateUser {
    url: string;
    userInfo: Partial<UserInfo> | any;
}

interface ICreateCustomer {
    url: string;
    customerInfo: Partial<Customer> | any;
}

interface ICreateCar {
    url: string;
    carInfo: Partial<Car> | any;
}


const fetcher = (url: string) => fetch(url).then(res => res.json());


const createUser = async ({ url, userInfo }: ICreateUser) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
    })

    if (!response.ok) {
        throw new Error('Failed to create user');
    }

    return response.json();
}


const createCustomer = async ({ url, customerInfo }: ICreateCustomer) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerInfo),
    })

    if (!response.ok) {
        throw new Error('Failed to create customer');
    }

    return response.json();
}



const editUser = async ({ url, userInfo }: ICreateUser) => {
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
        throw new Error('Failed to edit user');
    }

    return response.json();
};


const editCustomer = async ({ url, customerInfo }: ICreateCustomer) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerInfo),
    });

    if (!response.ok) {
        throw new Error('Failed to edit user');
    }

    return response.json();
};


const addCar = async ({ url, carInfo }: ICreateCar) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(carInfo),
    })

    if (!response.ok) {
        throw new Error('Failed to create user');
    }

    return response.json();
}


export { createUser, fetcher, editUser, editCustomer, createCustomer, addCar };