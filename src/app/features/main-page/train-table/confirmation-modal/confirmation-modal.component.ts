import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  availableSeats: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.availableSeats = data.placesMax - data.placesReservees;
  }

  ngOnInit(): void {}

  confirm() {
    // Logic for confirming the ticket purchase
    // You can handle the ticket purchase here or emit an event to notify the parent component
    // Once the ticket is confirmed, you can close the modal using dialogRef.close()
    this.dialogRef.close();
  }

  cancel() {
    // Logic for canceling the ticket purchase
    // You can handle any cleanup or cancellation process here
    // Once canceled, you can close the modal using dialogRef.close()
    this.dialogRef.close();
  }
}
