export interface Product{
    name:string;
    id:string;
    pricing:Pricing[]
}

export interface Pricing{
    'height':number,
    'width':number,
    'wrappedRate':number,
    'rolledRate':number
}