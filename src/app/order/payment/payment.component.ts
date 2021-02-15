import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Order } from 'src/datamodel/order';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';
import { OrderService } from 'src/app/order.service';
import { HelperService } from 'src/app/helper.service';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  ngOnInit() {
  }
}
