import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LandingComponent } from './landing/landing.component';
import { CollagePreviewComponent } from "./collage-preview/collage-preview.component";
import { CollageMakeComponent } from "./collage-make/collage-make.component";
//import { CollageWallComponent } from "./collage-wall/collage-wall.component";
import { TemplateMakerComponent } from "./admin/template-maker/template-maker.component";
import { TemplatePreviewComponent } from "./admin/template-maker/template-preview.component";
import { WallMakerComponent } from "./admin/wall-maker/wall-maker.component";
import { WallBackgroundComponent } from "./admin/wall-background/wall-background.component";
import { WallPreviewComponent } from "./admin/wall-maker/wall-preview.component";
import { ControlPanelComponent } from "./control-panel/control-panel.component";
import { SelectDialogComponent } from "./select-dialog/select-dialog.component";
import { SizeDialogComponent } from "./size-dialog/size-dialog.component";
import { ImageEditorComponent } from "./image-editor/image-editor.component";
import { ImageCropperComponent } from "./image-editor/image-cropper.component";
import { ImageUploadComponent } from "./image-upload/image-upload.component";
import { ImageSelectComponent } from "./image-select/image-select.component";
import { ImageListComponent } from "./image-list/image-list.component";
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
import { MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { NgxDropzoneModule } from "ngx-dropzone";
import { ColorPickerModule } from "ngx-color-picker";
import { MainNavComponent } from './main-nav/main-nav.component';
import { PreviewDialog, DialogLoginComponent } from './order/preview/preview.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { TokenInterceptor } from './services/token-interceptor';
import { TokenService } from './services/token.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgMasonryGridModule } from 'ng-masonry-grid';
import { ToastrModule } from "ngx-toastr";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatExpansionModule } from '@angular/material/expansion';

import { GlobalsService } from './../providers/globals-service';
import { VideoService } from './../providers/video-service';
import { CreatePostComponent } from './create-post/create-post.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { AlertModule } from 'ngx-alerts';
import { NgxImageCompressService } from 'ngx-image-compress'; // It should be added too
import { PriceDialogComponent } from './price-dialog/price-dialog.component';
import { WallSettingComponent } from './wall-setting-dialog/wall-setting.component';
import { CWallPreviewComponent } from './wall-preview/wall-preview.component';

const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'preview', component: CollagePreviewComponent },
  { path: 'collage/:mode', component: CollageMakeComponent },
  { path: 'collage-walls', component: CWallPreviewComponent },
  { path: 'admin/template', component: TemplateMakerComponent },
  { path: 'admin/templates', component: TemplatePreviewComponent },
  { path: 'admin/wall', component: WallMakerComponent },
  { path: 'admin/wall/background', component: WallBackgroundComponent },
  { path: 'admin/walls', component: WallPreviewComponent },
  { path: 'pictor/create-post', component: ImagePickerComponent },
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
    LandingComponent,
    CollagePreviewComponent,
    CollageMakeComponent,
    //CollageWallComponent,
    CWallPreviewComponent,
    TemplateMakerComponent,
    TemplatePreviewComponent,
    WallMakerComponent,
    WallBackgroundComponent,
    WallPreviewComponent,
    CartComponent,
    CrudComponent,
    ControlPanelComponent,
    SelectDialogComponent,
    PriceDialogComponent,
    WallSettingComponent,
    SizeDialogComponent,
    ImageEditorComponent,
    ImageCropperComponent,
    ImageUploadComponent,
    ImageSelectComponent,
    ImageListComponent,
    MainNavComponent,
    PreviewDialog,
    DialogLoginComponent,
    OrderSuccessComponent,
    CreatePostComponent,
    ImagePickerComponent
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
    ImageCropperModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: false }),
    AlertModule.forRoot({maxMessages: 5, timeout: 2000, positionX: 'right'}),
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
    ImageCropperComponent,
    CreatePostComponent,
  ],
  providers: [
    GlobalsService,
    VideoService,
    NgxImageCompressService,
    TokenService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  ],
  entryComponents: [PreviewDialog, DialogLoginComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
