
export interface Product {
    id_product: number,
    label: string,
    description: string,
    price: number
}

export interface ProductError {
    label?: string,
    price?: string
}

export const defaultProduct: Product = {
    id_product: 0,
    label: "",
    description: "",
    price: 0
}

export interface ResponseListProduct {
    success: boolean,
    message: string,
    result: Product[]
}