import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { Routes, RouterModule } from '@angular/router';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { OrderSelectorComponent } from './order-selector/order-selector.component';
import { CanvasComponent } from './canvas/canvas.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { TestComponent } from './test/test.component';
import { PaymentComponent } from './payment/payment.component';
import { PreviewComponent } from './preview/preview.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { NgxTTitanColorPickerModule } from "ngx-ttitan-color-picker";

const routes: Routes = [
  { path: '', component: OrderComponent },
  { path: 'gallary/:slug', component: OrderComponent },
  { path: 'edit', component: CanvasComponent },
  { path: 'payment', component: PaymentComponent }
]
@NgModule({
  imports: [
    ImageCropperModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
    NgxTTitanColorPickerModule

  ],
  entryComponents: [
    ColorPickerComponent
  ],
  declarations: [OrderComponent, OrderSelectorComponent, CanvasComponent, TestComponent, PaymentComponent, PreviewComponent, ColorPickerComponent]
})
export class OrderModule { }
