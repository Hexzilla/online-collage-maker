export interface NewOrder {
    orderId: any;
    customerId: any;
    orderStatus: any;
    amount: any;
    pinfo: any;
    fname: any;
    email: any;
    mobile: any;
    udf5: any;
    products: {
        type: any;
        corrections: any;
        size: any;
        wrapType: any;
        color?: any;
    };
    payment_mode: any;
    delivery_address: any;
    message: any;
    url: any;
    originalurl: any;
    tempPrice?: any;
}
