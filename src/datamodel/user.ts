export interface User {
    id?: string;
    uid: string;
    name?: string;
    photoUrl: string;
    firstname: string;
    lastname: string;
    shippingAddres: string;
    billingAddress: string;
    email: string;
    mobile: string;
    filePaths?: string[];
}
