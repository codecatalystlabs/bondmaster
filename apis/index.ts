import { Car } from "@/types/car";
import { Cost } from "@/types/cost-management";
import { Customer } from "@/types/customer";
import { Expense } from "@/types/expense";
import { Sale2 } from "@/types/sale";
import { UserInfo } from "@/types/user";

interface ICreateUser {
    url: string;
    userInfo: Partial<UserInfo> | any;
}
interface IExpense {
    url: string;
    expense: Partial<Expense> | any
}


interface ICarExpense {
    url: string;
    expense: Partial<Cost> | any
}

interface ICreateCustomer {
    url: string;
    customerInfo: Partial<Customer> | any;
}

interface ICreateCar {
    url: string;
    carInfo: Partial<Car> | any;
}

interface ISale {
    url: string;
    sale: Partial<Sale2> | any
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

const addCarExpenses = async ({ url, expense }: ICarExpense) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    })

    if (!response.ok) {
        throw new Error('Failed to add expense');
    }

    return response.json();
}

const addCompanyExpenses = async ({ url, expense }: IExpense) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    })

    if (!response.ok) {
        throw new Error('Failed to create user');
    }

    return response.json();
}


const updateExpense = async ({ url, expense }: IExpense) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
    });

    if (!response.ok) {
        throw new Error('Failed to edit expense');
    }

    return response.json();
};



const addSale = async ({ url, sale }: ISale) => {
    const response = await fetch(`https://clims.health.go.ug/api/${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sale)
    })

    if (!response.ok) {
        throw new Error('Failed to create sale');
    }

    return response.json();
}



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
    addSale
};