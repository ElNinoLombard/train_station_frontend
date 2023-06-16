import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  availableSeats: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastService: ToastService // Inject the ToastService
  ) {
    console.log(data);
    this.availableSeats = data.placesMax - data.placesReservees;
  }

  ngOnInit(): void {}

  confirm() {
    const trainName = this.data.train_nom;
    this.toastService.success(
      `Votre place pour ${trainName} a bien été réservée`
    ); // Trigger the success toast

    // Close the modal
    this.dialogRef.close();
  }

  cancel() {
    // Logic for canceling the ticket purchase
    // You can handle any cleanup or cancellation process here
    // Once canceled, you can close the modal using dialogRef.close()
    this.dialogRef.close();
  }
}
