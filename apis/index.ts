import { UserInfo } from "@/types/user";

interface ICreateUser {
    url: string;
    userInfo: UserInfo | any;
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


export { createUser, fetcher };