import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { MaterialModule } from '../material/material.module';
import { Routes, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';

const routes: Routes = [
  { path: '', component: ProfileComponent }
]

@NgModule({
  imports: [
    MaterialModule,
    MatExpansionModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }
