import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  private showToast = false;
  private toastMessage = '';

  show(message: string) {
    this.showToast = true;
    this.toastMessage = message;
  }

  hide() {
    this.showToast = false;
    this.toastMessage = '';
  }

  get isToastVisible() {
    return this.showToast;
  }

  get message() {
    return this.toastMessage;
  }

  success(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'end', // Position the snackbar at the end of the screen
      verticalPosition: 'top', // Position the snackbar at the top of the screen
    });
  }
}
