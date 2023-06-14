import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './features/main-page/main-page.component';
import { StaffPageComponent } from './features/staff-page/staff-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'staff', component: StaffPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
