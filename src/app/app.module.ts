import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';


import { AppComponent } from './app.component';
import { MainPageComponent } from './features/main-page/main-page.component';
import { TrainTableComponent } from './features/main-page/train-table/train-table.component';
import { ConfirmationModalComponent } from './features/main-page/train-table/confirmation-modal/confirmation-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    TrainTableComponent,
    ConfirmationModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
