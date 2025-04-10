
const apiUrl: string = 'http://localhost:5256/api/Auth';

export async function Authenticate(login: string, password: string): Promise<any> {
    let defaultRes: any = {
        success: false,
        message: "",
        result: null
    };

    try {
        const res = await fetch(apiUrl + '/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ Login: login, Password: password })
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