import { ApiResponse } from "@/models/common-model";
import { ResponseListUser, User } from "@/models/user-model";

const apiUrl: string = 'http://localhost:5256/api/User';

export async function GetAllUser(token: string): Promise<ResponseListUser> {
    let defaultRes: ResponseListUser = {
        success: false,
        message: "",
        result: []
    };
    try {
        const res = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status != 200) {
            throw new Error('Erreur lors du chargement des utilisateurs');
        }
        return await res.json();
    }
    catch (error) {
        defaultRes.message = "Erreur lors du chargement des utilisateurs";
        return defaultRes;
    };
}

export async function SaveUser(user: User): Promise<any> {
    let defaultRes: ApiResponse = {
        success: false,
        message: "Erreur lors de l\'enregistrement de l'utilisateur"
    };
    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user)
        });
        if (res.status != 200) {
            return defaultRes;
        }
        return await res.json();
    }
    catch (error) {
        return defaultRes;
    };
}

export async function DeleteUser(id_user: number, token: string): Promise<any> {
    let defaultRes: ApiResponse = {
        success: false,
        message: 'Erreur lors de la suppression de l\'utilisateur'
    };
    try {
        const url = apiUrl + `/${id_user}`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status != 200) {
            return defaultRes;
        }
        return await res.json();
    }
    catch (error) {
        return defaultRes;
    };
}

export async function UpdateUser(user: User, token: string): Promise<any> {
    let defaultRes: ApiResponse = {
        success: false,
        message: "Erreur lors de la modification"
    };
    try {
        const res = await fetch(apiUrl + `/${user?.id_user}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
             },
            body: JSON.stringify(user)
        });
        if (res.status != 200) {
            return defaultRes;
        }
        return await res.json();
    }
    catch (error) {
        return defaultRes;
    };
}