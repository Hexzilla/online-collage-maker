import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// firebase imports
// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';

// import { AngularFireAuthModule } from '@angular/fire/auth';

import { MaterialModule } from './material/material.module';

import { SidenavComponent } from './sidenav/sidenav.component';
import { CollagePreviewComponent } from "./collage-preview/collage-preview.component";
import { CollageMakeComponent } from "./collage-make/collage-make.component";
import { CollageTemplateComponent } from "./collage-template/collage-template.component";
import { ControlPanelComponent } from "./control-panel/control-panel.component";
import { ImageEditorComponent } from "./image-editor/image-editor.component";
import { ImageUploadComponent } from "./image-upload/image-upload.component";
import { FooterComponent } from './footer/footer.component';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CartComponent } from './cart/cart.component';

import { CrudComponent } from './crud/crud.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet"
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { NgxDropzoneModule } from "ngx-dropzone";
import { ColorPickerModule } from "ngx-color-picker";
import { MainNavComponent } from './main-nav/main-nav.component';
import { PreviewDialog, DialogLoginComponent } from './order/preview/preview.component';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { TokenInterceptor } from './services/token-interceptor';
import { TokenService } from './services/token.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgMasonryGridModule } from 'ng-masonry-grid';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ToastrModule } from "ngx-toastr";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const appRoutes: Routes = [
  { path: '', component: CollagePreviewComponent },
  { path: 'collage', component: CollageMakeComponent },
  { path: 'home', pathMatch: 'full', redirectTo: '' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
  { path: 'order', loadChildren: './order/order.module#OrderModule' },
  { path: 'cart', component: CartComponent },
  { path: 'crud', component: CrudComponent },
  { path: 'success', component: OrderSuccessComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    FooterComponent,
    CollagePreviewComponent,
    CollageMakeComponent,
    CollageTemplateComponent,
    CartComponent,
    CrudComponent,
    ControlPanelComponent,
    ImageEditorComponent,
    ImageUploadComponent,
    MainNavComponent,
    PreviewDialog,
    DialogLoginComponent,
    OrderSuccessComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    HttpClientModule,
    MatMenuModule,
    MatSelectModule,
    MatSliderModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatCheckboxModule,
    NgxDropzoneModule,
    ColorPickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatCarouselModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: false }),
    HttpClientModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    NgbModule,
  ],
  exports: [
    MatSliderModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatBottomSheetModule,
    MatListModule,
    ImageEditorComponent,
  ],
  providers: [
    TokenService,
    NgxImageCompressService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  ],
  entryComponents: [PreviewDialog, DialogLoginComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
