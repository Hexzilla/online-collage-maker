import { Size } from 'src/app/order/test/test.component';
import { User } from './user';

export interface Order {
    orderId?: string;
    imgsrc?: any;
    createdOn: number;
    size: Size;
    productInfo: string;
    amount: any;
    user: User;
    selectedWrap?: any;
    previewColor?: any;
    discount?: any;
    note?: any;
}