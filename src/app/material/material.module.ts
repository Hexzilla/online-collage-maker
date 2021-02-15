import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatRippleModule} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatToolbarModule, MatIconModule, MatSidenavModule,
    MatRippleModule, MatTabsModule, MatProgressBarModule, MatGridListModule, MatSelectModule,
    MatListModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatCardModule,
    MatStepperModule, MatDialogModule, MatChipsModule, MatExpansionModule,MatTooltipModule],

  exports: [CommonModule, MatButtonModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatSelectModule,
    MatRippleModule, MatTabsModule, MatProgressBarModule, MatGridListModule, MatChipsModule,
    MatListModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatCardModule, MatStepperModule,
    MatDialogModule, MatExpansionModule,MatTooltipModule],
})
export class MaterialModule { }
