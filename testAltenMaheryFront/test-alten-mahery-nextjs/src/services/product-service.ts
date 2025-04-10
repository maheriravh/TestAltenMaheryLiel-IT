import { ApiResponse } from "@/models/common-model";
import { Product, ResponseListProduct } from "@/models/product-model";

const apiUrl: string = 'http://localhost:5256/api/Product';


export async function GetAllProduct(token: string): Promise<ResponseListProduct> {
    let defaultRes: ResponseListProduct = {
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
            throw new Error('Erreur lors du chargement des produits');
        }
        return await res.json();
    }
    catch (error) {
        defaultRes.message = "Erreur lors du chargement des produits";
        return defaultRes;
    };
}

export async function SaveProduct(product: Product, token: string): Promise<any> {
    let defaultRes: ApiResponse = {
        success: false,
        message: "Erreur lors de la suppression du produit"
    };
    try {
        const url = apiUrl + (product?.id_product === 0 ? '' : `/${product.id_product}`);
        const res = await fetch(url, {
            method: product?.id_product === 0 ? 'POST' : 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
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

export async function DeleteProduct(id_product: number, token: string): Promise<any> {
    let defaultRes: ApiResponse = {
            success: false,
            message: "Erreur lors de la suppression du produit"
        };
    try {
        const url = apiUrl + `/${id_product}`;
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