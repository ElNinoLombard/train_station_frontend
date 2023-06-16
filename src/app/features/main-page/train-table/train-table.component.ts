import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { TrainService } from 'src/app/shared/train.service';
import { Router } from '@angular/router';
import { EditTrainComponent } from '../../staff-page/edit-train/edit-train.component';

@Component({
  selector: 'app-train-table',
  templateUrl: './train-table.component.html',
  styleUrls: ['./train-table.component.scss'],
})
export class TrainTableComponent implements OnInit {
  @Input() trains: any[] = [];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private trainService: TrainService
  ) {}

  ngOnInit() {
    this.trainService.getTrainData().subscribe(
      (data: any) => {
        this.trains = data.data; // Assign the fetched data to the trains property
        console.log('Train data fetched:', data);
      },
      (error: any) => {
        console.error('Error fetching train data:', error);
      }
    );
  }

  getSeverity(placesReservees: number, placesMax: number): string {
    const percentage = (placesReservees / placesMax) * 100;

    if (percentage >= 75) {
      return 'danger'; // High percentage of places reserved
    } else if (percentage >= 50) {
      return 'warning'; // Moderate percentage of places reserved
    } else {
      return 'success'; // Low percentage of places reserved
    }
  }

  openConfirmationModal(trajet: any) {
    const trajetWithSpecs = { ...trajet, specs: trajet.specs };
    this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: trajetWithSpecs,
    });
  }

  openEditTrainModal(trajet: any) {
    const dialogRef = this.dialog.open(EditTrainComponent, {
      width: '400px',
      data: trajet,
    });

    dialogRef.afterClosed().subscribe((updatedTrainData: any) => {
      if (updatedTrainData) {
        // Update the train data in the TrainTableComponent
        const index = this.trains.findIndex(
          (t) => t.trainName === updatedTrainData.trainName
        );
        if (index !== -1) {
          this.trains[index] = updatedTrainData;
        }
      }
    });
  }

  isStaffPage(): boolean {
    return this.router.url === '/staff';
  }
}
