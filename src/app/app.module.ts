import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { MainPageComponent } from './features/main-page/main-page.component';
import { TrainTableComponent } from './features/main-page/train-table/train-table.component';
import { ConfirmationModalComponent } from './features/main-page/train-table/confirmation-modal/confirmation-modal.component';
import { ToastComponent } from './shared/toast/toast.component';
import { StaffPageComponent } from './features/staff-page/staff-page.component';
import { EditTrainComponent } from './features/staff-page/edit-train/edit-train.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    TrainTableComponent,
    ConfirmationModalComponent,
    ToastComponent,
    StaffPageComponent,
    EditTrainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
